import { parse, recast, initPromise } from './wasm'
import {
  findAllPreviousVariables,
  isNodeSafeToReplace,
  isTypeInValue,
  getNodePathFromSourceRange,
  doesPipeHaveCallExp,
  hasExtrudeSketchGroup,
} from './queryAst'
import { enginelessExecutor } from '../lib/testHelpers'
import {
  createArrayExpression,
  createCallExpression,
  createLiteral,
  createPipeSubstitution,
} from './modifyAst'

beforeAll(async () => {
  await initPromise
})

describe('findAllPreviousVariables', () => {
  it('should find all previous variables', async () => {
    const code = `const baseThick = 1
const armAngle = 60

const baseThickHalf = baseThick / 2
const halfArmAngle = armAngle / 2

const arrExpShouldNotBeIncluded = [1, 2, 3]
const objExpShouldNotBeIncluded = { a: 1, b: 2, c: 3 }

const part001 = startSketchOn('XY')
  |> startProfileAt([0, 0], %)
  |> yLineTo(1, %)
  |> xLine(3.84, %) // selection-range-7ish-before-this

const variableBelowShouldNotBeIncluded = 3
`
    const rangeStart = code.indexOf('// selection-range-7ish-before-this') - 7
    const ast = parse(code)
    const programMemory = await enginelessExecutor(ast)

    const { variables, bodyPath, insertIndex } = findAllPreviousVariables(
      ast,
      programMemory,
      [rangeStart, rangeStart]
    )
    expect(variables).toEqual([
      { key: 'baseThick', value: 1 },
      { key: 'armAngle', value: 60 },
      { key: 'baseThickHalf', value: 0.5 },
      { key: 'halfArmAngle', value: 30 },
      // no arrExpShouldNotBeIncluded, variableBelowShouldNotBeIncluded etc
    ])
    // there are 4 number variables and 2 non-number variables before the sketch var
    // ∴ the insert index should be 6
    expect(insertIndex).toEqual(6)
    expect(bodyPath).toEqual([['body', '']])
  })
})

describe('testing argIsNotIdentifier', () => {
  const code = `const part001 = startSketchOn('XY')
|> startProfileAt([-1.2, 4.83], %)
|> line([2.8, 0], %)
|> angledLine([100 + 100, 3.09], %)
|> angledLine([abc, 3.09], %)
|> angledLine([def('yo'), 3.09], %)
|> angledLine([ghi(%), 3.09], %)
|> angledLine([jkl('yo') + 2, 3.09], %)
const yo = 5 + 6
const yo2 = hmm([identifierGuy + 5])`
  it('find a safe binaryExpression', () => {
    const ast = parse(code)
    const rangeStart = code.indexOf('100 + 100') + 2
    const result = isNodeSafeToReplace(ast, [rangeStart, rangeStart])
    expect(result.isSafe).toBe(true)
    expect(result.value?.type).toBe('BinaryExpression')
    expect(code.slice(result.value.start, result.value.end)).toBe('100 + 100')
    const { modifiedAst } = result.replacer(
      JSON.parse(JSON.stringify(ast)),
      'replaceName'
    )
    const outCode = recast(modifiedAst)
    expect(outCode).toContain(`angledLine([replaceName, 3.09], %)`)
  })
  it('find a safe Identifier', () => {
    const ast = parse(code)
    const rangeStart = code.indexOf('abc')
    const result = isNodeSafeToReplace(ast, [rangeStart, rangeStart])
    expect(result.isSafe).toBe(true)
    expect(result.value?.type).toBe('Identifier')
    expect(code.slice(result.value.start, result.value.end)).toBe('abc')
  })
  it('find a safe CallExpression', () => {
    const ast = parse(code)
    const rangeStart = code.indexOf('def')
    const result = isNodeSafeToReplace(ast, [rangeStart, rangeStart])
    expect(result.isSafe).toBe(true)
    expect(result.value?.type).toBe('CallExpression')
    expect(code.slice(result.value.start, result.value.end)).toBe("def('yo')")
    const { modifiedAst } = result.replacer(
      JSON.parse(JSON.stringify(ast)),
      'replaceName'
    )
    const outCode = recast(modifiedAst)
    expect(outCode).toContain(`angledLine([replaceName, 3.09], %)`)
  })
  it('find an UNsafe CallExpression, as it has a PipeSubstitution', () => {
    const ast = parse(code)
    const rangeStart = code.indexOf('ghi')
    const range: [number, number] = [rangeStart, rangeStart]
    const result = isNodeSafeToReplace(ast, range)
    expect(result.isSafe).toBe(false)
    expect(result.value?.type).toBe('CallExpression')
    expect(code.slice(result.value.start, result.value.end)).toBe('ghi(%)')
  })
  it('find an UNsafe Identifier, as it is a callee', () => {
    const ast = parse(code)
    const rangeStart = code.indexOf('ine([2.8,')
    const result = isNodeSafeToReplace(ast, [rangeStart, rangeStart])
    expect(result.isSafe).toBe(false)
    expect(result.value?.type).toBe('CallExpression')
    expect(code.slice(result.value.start, result.value.end)).toBe(
      'line([2.8, 0], %)'
    )
  })
  it("find a safe BinaryExpression that's assigned to a variable", () => {
    const ast = parse(code)
    const rangeStart = code.indexOf('5 + 6') + 1
    const result = isNodeSafeToReplace(ast, [rangeStart, rangeStart])
    expect(result.isSafe).toBe(true)
    expect(result.value?.type).toBe('BinaryExpression')
    expect(code.slice(result.value.start, result.value.end)).toBe('5 + 6')
    const { modifiedAst } = result.replacer(
      JSON.parse(JSON.stringify(ast)),
      'replaceName'
    )
    const outCode = recast(modifiedAst)
    expect(outCode).toContain(`const yo = replaceName`)
  })
  it('find a safe BinaryExpression that has a CallExpression within', () => {
    const ast = parse(code)
    const rangeStart = code.indexOf('jkl') + 1
    const result = isNodeSafeToReplace(ast, [rangeStart, rangeStart])
    expect(result.isSafe).toBe(true)
    expect(result.value?.type).toBe('BinaryExpression')
    expect(code.slice(result.value.start, result.value.end)).toBe(
      "jkl('yo') + 2"
    )
    const { modifiedAst } = result.replacer(
      JSON.parse(JSON.stringify(ast)),
      'replaceName'
    )
    const outCode = recast(modifiedAst)
    expect(outCode).toContain(`angledLine([replaceName, 3.09], %)`)
  })
  it('find a safe BinaryExpression within a CallExpression', () => {
    const ast = parse(code)
    const rangeStart = code.indexOf('identifierGuy') + 1
    const result = isNodeSafeToReplace(ast, [rangeStart, rangeStart])
    expect(result.isSafe).toBe(true)
    expect(result.value?.type).toBe('BinaryExpression')
    expect(code.slice(result.value.start, result.value.end)).toBe(
      'identifierGuy + 5'
    )
    const { modifiedAst } = result.replacer(
      JSON.parse(JSON.stringify(ast)),
      'replaceName'
    )
    const outCode = recast(modifiedAst)
    expect(outCode).toContain(`const yo2 = hmm([replaceName])`)
  })

  describe('testing isTypeInValue', () => {
    it('finds the pipeSubstituion', () => {
      const val = createCallExpression('yoyo', [
        createArrayExpression([
          createLiteral(1),
          createCallExpression('yoyo2', [createPipeSubstitution()]),
          createLiteral('hey'),
        ]),
      ])
      expect(isTypeInValue(val, 'PipeSubstitution')).toBe(true)
    })
    it('There is no pipeSubstituion', () => {
      const val = createCallExpression('yoyo', [
        createArrayExpression([
          createLiteral(1),
          createCallExpression('yoyo2', [createLiteral(5)]),
          createLiteral('hey'),
        ]),
      ])
      expect(isTypeInValue(val, 'PipeSubstitution')).toBe(false)
    })
  })
})

describe('testing getNodePathFromSourceRange', () => {
  const code = `const part001 = startSketchOn('XY')
  |> startProfileAt([0.39, -0.05], %)
  |> line([0.94, 2.61], %)
  |> line([-0.21, -1.4], %)`
  it('finds the second line when cursor is put at the end', () => {
    const searchLn = `line([0.94, 2.61], %)`
    const sourceIndex = code.indexOf(searchLn) + searchLn.length
    const ast = parse(code)
    const result = getNodePathFromSourceRange(ast, [sourceIndex, sourceIndex])
    expect(result).toEqual([
      ['body', ''],
      [0, 'index'],
      ['declarations', 'VariableDeclaration'],
      [0, 'index'],
      ['init', ''],
      ['body', 'PipeExpression'],
      [2, 'index'],
    ])
  })
  it('finds the last line when cursor is put at the end', () => {
    const searchLn = `line([-0.21, -1.4], %)`
    const sourceIndex = code.indexOf(searchLn) + searchLn.length
    const ast = parse(code)
    const result = getNodePathFromSourceRange(ast, [sourceIndex, sourceIndex])
    const expected = [
      ['body', ''],
      [0, 'index'],
      ['declarations', 'VariableDeclaration'],
      [0, 'index'],
      ['init', ''],
      ['body', 'PipeExpression'],
      [3, 'index'],
    ]
    expect(result).toEqual(expected)
    // expect similar result for start of line
    const startSourceIndex = code.indexOf(searchLn)
    const startResult = getNodePathFromSourceRange(ast, [
      startSourceIndex,
      startSourceIndex,
    ])
    expect(startResult).toEqual([...expected, ['callee', 'CallExpression']])
    // expect similar result when whole line is selected
    const selectWholeThing = getNodePathFromSourceRange(ast, [
      startSourceIndex,
      sourceIndex,
    ])
    expect(selectWholeThing).toEqual(expected)
  })
})

describe('testing doesPipeHave', () => {
  it('finds close', () => {
    const exampleCode = `const length001 = 2
const part001 = startSketchAt([-1.41, 3.46])
  |> line([19.49, 1.16], %, 'seg01')
  |> angledLine([-35, length001], %)
  |> line([-3.22, -7.36], %)
  |> angledLine([-175, segLen('seg01', %)], %)
  |> close(%)
`
    const ast = parse(exampleCode)
    const result = doesPipeHaveCallExp({
      calleeName: 'close',
      ast,
      selection: { type: 'default', range: [100, 101] },
    })
    expect(result).toEqual(true)
  })
  it('finds extrude', () => {
    const exampleCode = `const length001 = 2
const part001 = startSketchAt([-1.41, 3.46])
  |> line([19.49, 1.16], %, 'seg01')
  |> angledLine([-35, length001], %)
  |> line([-3.22, -7.36], %)
  |> angledLine([-175, segLen('seg01', %)], %)
  |> close(%)
  |> extrude(1, %)
`
    const ast = parse(exampleCode)
    const result = doesPipeHaveCallExp({
      calleeName: 'extrude',
      ast,
      selection: { type: 'default', range: [100, 101] },
    })
    expect(result).toEqual(true)
  })
  it('does NOT find close', () => {
    const exampleCode = `const length001 = 2
const part001 = startSketchAt([-1.41, 3.46])
  |> line([19.49, 1.16], %, 'seg01')
  |> angledLine([-35, length001], %)
  |> line([-3.22, -7.36], %)
  |> angledLine([-175, segLen('seg01', %)], %)
`
    const ast = parse(exampleCode)
    const result = doesPipeHaveCallExp({
      calleeName: 'close',
      ast,
      selection: { type: 'default', range: [100, 101] },
    })
    expect(result).toEqual(false)
  })
  it('returns false if not a pipe', () => {
    const exampleCode = `const length001 = 2`
    const ast = parse(exampleCode)
    const result = doesPipeHaveCallExp({
      calleeName: 'close',
      ast,
      selection: { type: 'default', range: [9, 10] },
    })
    expect(result).toEqual(false)
  })
})

describe('testing hasExtrudeSketchGroup', () => {
  it('find sketch group', async () => {
    const exampleCode = `const length001 = 2
const part001 = startSketchAt([-1.41, 3.46])
  |> line([19.49, 1.16], %, 'seg01')
  |> angledLine([-35, length001], %)
  |> line([-3.22, -7.36], %)
  |> angledLine([-175, segLen('seg01', %)], %)`
    const ast = parse(exampleCode)
    const programMemory = await enginelessExecutor(ast)
    const result = hasExtrudeSketchGroup({
      ast,
      selection: { type: 'default', range: [100, 101] },
      programMemory,
    })
    expect(result).toEqual(true)
  })
  it('find extrude group', async () => {
    const exampleCode = `const length001 = 2
const part001 = startSketchAt([-1.41, 3.46])
  |> line([19.49, 1.16], %, 'seg01')
  |> angledLine([-35, length001], %)
  |> line([-3.22, -7.36], %)
  |> angledLine([-175, segLen('seg01', %)], %)
  |> extrude(1, %)`
    const ast = parse(exampleCode)
    const programMemory = await enginelessExecutor(ast)
    const result = hasExtrudeSketchGroup({
      ast,
      selection: { type: 'default', range: [100, 101] },
      programMemory,
    })
    expect(result).toEqual(true)
  })
  it('finds nothing', async () => {
    const exampleCode = `const length001 = 2`
    const ast = parse(exampleCode)
    const programMemory = await enginelessExecutor(ast)
    const result = hasExtrudeSketchGroup({
      ast,
      selection: { type: 'default', range: [10, 11] },
      programMemory,
    })
    expect(result).toEqual(false)
  })
})
