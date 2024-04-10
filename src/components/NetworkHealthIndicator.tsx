import { Popover } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { ActionIcon, ActionIconProps } from './ActionIcon'
import {
  ConnectingType,
  ConnectingTypeGroup,
  DisconnectingType,
  engineCommandManager,
  EngineCommandManagerEvents,
  EngineConnectionEvents,
  EngineConnectionState,
  EngineConnectionStateType,
  ErrorType,
  initialConnectingTypeGroupState,
} from '../lang/std/engineConnection'
import { engineCommandManager } from '../lib/singletons'
import Tooltip from './Tooltip'

export enum NetworkHealthState {
  Ok,
  Issue,
  Disconnected,
}

export const NETWORK_HEALTH_TEXT: Record<NetworkHealthState, string> = {
  [NetworkHealthState.Ok]: 'Connected',
  [NetworkHealthState.Issue]: 'Problem',
  [NetworkHealthState.Disconnected]: 'Offline',
}

type IconColorConfig = {
  icon: string
  bg: string
}

const hasIssueToIcon: Record<
  string | number | symbol,
  ActionIconProps['icon']
> = {
  true: 'close',
  undefined: 'horizontalDash',
  false: 'checkmark',
}

const hasIssueToIconColors: Record<string | number | symbol, IconColorConfig> =
  {
    true: {
      icon: 'text-destroy-80 dark:text-destroy-10',
      bg: 'bg-destroy-10 dark:bg-destroy-80',
    },
    undefined: {
      icon: 'text-chalkboard-70 dark:text-chalkboard-30',
      bg: 'bg-chalkboard-30 dark:bg-chalkboard-70',
    },
    false: {
      icon: '!text-chalkboard-110 dark:!text-chalkboard-10',
      bg: 'bg-transparent dark:bg-transparent',
    },
  }

const overallConnectionStateColor: Record<NetworkHealthState, IconColorConfig> =
  {
    [NetworkHealthState.Ok]: {
      icon: 'text-succeed-80 dark:text-succeed-10',
      bg: 'bg-succeed-10/30 dark:bg-succeed-80/50',
    },
    [NetworkHealthState.Issue]: {
      icon: 'text-destroy-80 dark:text-destroy-10',
      bg: 'bg-destroy-10 dark:bg-destroy-80/80',
    },
    [NetworkHealthState.Disconnected]: {
      icon: 'text-destroy-80 dark:text-destroy-10',
      bg: 'bg-destroy-10 dark:bg-destroy-80',
    },
  }

const overallConnectionStateIcon: Record<
  NetworkHealthState,
  ActionIconProps['icon']
> = {
  [NetworkHealthState.Ok]: 'network',
  [NetworkHealthState.Issue]: 'networkCrossedOut',
  [NetworkHealthState.Disconnected]: 'networkCrossedOut',
}

export function useNetworkStatus() {
  const [steps, setSteps] = useState(
    structuredClone(initialConnectingTypeGroupState)
  )
  const [internetConnected, setInternetConnected] = useState<boolean>(true)
  const [overallState, setOverallState] = useState<NetworkHealthState>(
    NetworkHealthState.Disconnected
  )
  const [pingPongHealth, setPingPongHealth] = useState<'OK' | 'BAD'>('BAD')
  const [hasCopied, setHasCopied] = useState<boolean>(false)

  const [error, setError] = useState<ErrorType | undefined>(undefined)

  const hasIssue = (i: [ConnectingType, boolean | undefined]) =>
    i[1] === undefined ? i[1] : !i[1]

  const [issues, setIssues] = useState<
    Record<ConnectingTypeGroup, boolean | undefined>
  >({
    [ConnectingTypeGroup.WebSocket]: undefined,
    [ConnectingTypeGroup.ICE]: undefined,
    [ConnectingTypeGroup.WebRTC]: undefined,
  })

  const [hasIssues, setHasIssues] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    setOverallState(
      !internetConnected
        ? NetworkHealthState.Disconnected
        : hasIssues || hasIssues === undefined
        ? NetworkHealthState.Issue
        : NetworkHealthState.Ok
    )
  }, [hasIssues, internetConnected])

  useEffect(() => {
    const onlineCallback = () => {
      setSteps(initialConnectingTypeGroupState)
      setInternetConnected(true)
    }
    const offlineCallback = () => {
      setInternetConnected(false)
    }
    window.addEventListener('online', onlineCallback)
    window.addEventListener('offline', offlineCallback)
    return () => {
      window.removeEventListener('online', onlineCallback)
      window.removeEventListener('offline', offlineCallback)
    }
  }, [])

  useEffect(() => {
    console.log(pingPongHealth)
  }, [pingPongHealth])

  useEffect(() => {
    const issues = {
      [ConnectingTypeGroup.WebSocket]: steps[
        ConnectingTypeGroup.WebSocket
      ].reduce(
        (acc: boolean | undefined, a) =>
          acc === true || acc === undefined ? acc : hasIssue(a),
        false
      ),
      [ConnectingTypeGroup.ICE]: steps[ConnectingTypeGroup.ICE].reduce(
        (acc: boolean | undefined, a) =>
          acc === true || acc === undefined ? acc : hasIssue(a),
        false
      ),
      [ConnectingTypeGroup.WebRTC]: steps[ConnectingTypeGroup.WebRTC].reduce(
        (acc: boolean | undefined, a) =>
          acc === true || acc === undefined ? acc : hasIssue(a),
        false
      ),
    }
    setIssues(issues)
  }, [steps])

  useEffect(() => {
    setHasIssues(
      issues[ConnectingTypeGroup.WebSocket] ||
        issues[ConnectingTypeGroup.ICE] ||
        issues[ConnectingTypeGroup.WebRTC]
    )
  }, [issues])

  useEffect(() => {
    const onPingPongChange = ({ detail: state }: CustomEvent) => {
      setPingPongHealth(state)
    }

    const onConnectionStateChange = ({
      detail: engineConnectionState,
    }: CustomEvent) => {
      setSteps((steps) => {
        let nextSteps = structuredClone(steps)

        if (
          engineConnectionState.type === EngineConnectionStateType.Connecting
        ) {
          const groups = Object.values(nextSteps)
          for (let group of groups) {
            for (let step of group) {
              if (step[0] !== engineConnectionState.value.type) continue
              step[1] = true
            }
          }
        }

        if (
          engineConnectionState.type === EngineConnectionStateType.Disconnecting
        ) {
          const groups = Object.values(nextSteps)
          for (let group of groups) {
            for (let step of group) {
              if (
                engineConnectionState.value.type === DisconnectingType.Error
              ) {
                if (
                  engineConnectionState.value.value.lastConnectingValue
                    ?.type === step[0]
                ) {
                  step[1] = false
                }
              }
            }

            if (engineConnectionState.value.type === DisconnectingType.Error) {
              setError(engineConnectionState.value.value)
            }
          }
        }

        // Reset the state of all steps if we have disconnected.
        if (
          engineConnectionState.type === EngineConnectionStateType.Disconnected
        ) {
          return structuredClone(initialConnectingTypeGroupState)
        }

        return nextSteps
      })
    }

    const onEngineAvailable = ({ detail: engineConnection }: CustomEvent) => {
      engineConnection.addEventListener(
        EngineConnectionEvents.PingPongChanged,
        onPingPongChange as EventListener
      )
      engineConnection.addEventListener(
        EngineConnectionEvents.ConnectionStateChanged,
        onConnectionStateChange as EventListener
      )
    }

    engineCommandManager.addEventListener(
      EngineCommandManagerEvents.EngineAvailable,
      onEngineAvailable as EventListener
    )

    return () => {
      engineCommandManager.removeEventListener(
        EngineCommandManagerEvents.EngineAvailable,
        onEngineAvailable as EventListener
      )

      // When the component is unmounted these should be assigned, but it's possible
      // the component mounts and unmounts before engine is available.
      engineCommandManager.engineConnection?.addEventListener(
        EngineConnectionEvents.PingPongChanged,
        onPingPongChange as EventListener
      )
      engineCommandManager.engineConnection?.addEventListener(
        EngineConnectionEvents.ConnectionStateChanged,
        onConnectionStateChange as EventListener
      )
    }
  }, [])

  return {
    hasIssues,
    overallState,
    internetConnected,
    steps,
    issues,
    error,
    setHasCopied,
    hasCopied,
    pingPongHealth,
  }
}

export const NetworkHealthIndicator = () => {
  const {
    hasIssues,
    overallState,
    internetConnected,
    steps,
    issues,
    error,
    setHasCopied,
    hasCopied,
  } = useNetworkStatus()

  return (
    <Popover className="relative">
      <Popover.Button
        className={
          'p-0 border-none bg-transparent dark:bg-transparent relative ' +
          (hasIssues
            ? 'focus-visible:outline-destroy-80'
            : 'focus-visible:outline-succeed-80')
        }
        data-testid="network-toggle"
      >
        <span className="sr-only">Network Health</span>
        <ActionIcon
          icon={overallConnectionStateIcon[overallState]}
          className="p-1"
          iconClassName={overallConnectionStateColor[overallState].icon}
          bgClassName={
            'rounded-sm ' + overallConnectionStateColor[overallState].bg
          }
        />
        <Tooltip position="left" delay={750} className="ui-open:hidden">
          Network Health ({NETWORK_HEALTH_TEXT[overallState]})
        </Tooltip>
      </Popover.Button>
      <Popover.Panel className="absolute right-0 left-auto top-full mt-1 w-64 flex flex-col gap-1 align-stretch bg-chalkboard-10 dark:bg-chalkboard-90 rounded shadow-lg border border-solid border-chalkboard-20/50 dark:border-chalkboard-80/50 text-sm">
        <div
          className={`flex items-center justify-between p-2 rounded-t-sm ${overallConnectionStateColor[overallState].bg} ${overallConnectionStateColor[overallState].icon}`}
        >
          <h2 className="text-sm font-sans font-normal">Network health</h2>
          <p
            data-testid="network"
            className="font-bold text-xs uppercase px-2 py-1 rounded-sm"
          >
            {NETWORK_HEALTH_TEXT[overallState]}
          </p>
        </div>
        <ul className="divide-y divide-chalkboard-20 dark:divide-chalkboard-80">
          {Object.keys(steps).map((name) => (
            <li
              key={name}
              className={'flex flex-col px-2 py-4 gap-1 last:mb-0 '}
            >
              <div className="flex items-center text-left gap-1">
                <p className="flex-1">{name}</p>
                {internetConnected ? (
                  <ActionIcon
                    size="lg"
                    icon={
                      hasIssueToIcon[
                        String(issues[name as ConnectingTypeGroup])
                      ]
                    }
                    iconClassName={
                      hasIssueToIconColors[
                        String(issues[name as ConnectingTypeGroup])
                      ].icon
                    }
                    bgClassName={
                      'rounded-sm ' +
                      hasIssueToIconColors[
                        String(issues[name as ConnectingTypeGroup])
                      ].bg
                    }
                  />
                ) : (
                  <ActionIcon
                    icon={hasIssueToIcon.true}
                    bgClassName={hasIssueToIconColors.true.bg}
                    iconClassName={hasIssueToIconColors.true.icon}
                  />
                )}
              </div>
              {issues[name as ConnectingTypeGroup] && (
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      JSON.stringify(error, null, 2) || ''
                    )
                    setHasCopied(true)
                    setTimeout(() => setHasCopied(false), 5000)
                  }}
                  className="flex w-fit gap-2 items-center bg-transparent text-sm p-1 py-0 my-0 -mx-1 text-destroy-80 dark:text-destroy-10 hover:bg-transparent border-transparent dark:border-transparent hover:border-destroy-80 dark:hover:border-destroy-80 dark:hover:bg-destroy-80"
                >
                  {hasCopied ? 'Copied' : 'Copy Error'}
                  <ActionIcon
                    size="lg"
                    icon={hasCopied ? 'clipboardCheckmark' : 'clipboardPlus'}
                    iconClassName="text-inherit dark:text-inherit"
                    bgClassName="!bg-transparent"
                  />
                </button>
              )}
            </li>
          ))}
        </ul>
      </Popover.Panel>
    </Popover>
  )
}
