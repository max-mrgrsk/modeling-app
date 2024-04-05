import { cloneElement } from 'react'

const CustomIconMap = {
  arc: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.5C8.60217 1.5 7.22591 1.84474 5.99313 2.50367C4.76035 3.1626 3.70911 4.1154 2.93251 5.27765C2.15592 6.43991 1.67794 7.77575 1.54093 9.16685C1.40392 10.558 1.6121 11.9614 2.14703 13.2528C2.68195 14.5442 3.52712 15.6838 4.60766 16.5706C5.6882 17.4574 6.97076 18.064 8.34173 18.3367C9.71271 18.6094 11.1298 18.5398 12.4674 18.134C13.8051 17.7282 15.022 16.9988 16.0104 16.0104C16.3068 15.714 16.5796 15.3974 16.8273 15.0634L16.0241 14.4677C15.8055 14.7624 15.5648 15.0418 15.3033 15.3033C14.4312 16.1754 13.3574 16.819 12.1771 17.1771C10.9969 17.5351 9.74651 17.5965 8.53682 17.3559C7.32714 17.1153 6.19547 16.58 5.24205 15.7976C4.28863 15.0151 3.5429 14.0096 3.07091 12.8701C2.59891 11.7306 2.41522 10.4923 2.53612 9.26487C2.65701 8.03743 3.07875 6.85874 3.76398 5.83322C4.44921 4.8077 5.37678 3.967 6.46453 3.38559C7.55227 2.80418 8.76662 2.5 10 2.5C10.3699 2.5 10.7376 2.52734 11.1005 2.58117L11.2472 1.59199C10.836 1.53099 10.4192 1.5 10 1.5ZM13.2067 3.22008C13.5383 3.37691 13.8593 3.5585 14.1668 3.76398C14.4743 3.96946 14.7649 4.19652 15.0367 4.44286L15.7083 3.70191C15.4002 3.42271 15.0709 3.16538 14.7223 2.93251C14.3738 2.69964 14.0101 2.49384 13.6342 2.31609L13.2067 3.22008ZM16.433 6.14423C16.6216 6.45886 16.7876 6.78818 16.9291 7.12987C17.0706 7.47157 17.1861 7.82181 17.2752 8.17765L18.2453 7.93467C18.1443 7.53138 18.0134 7.13444 17.853 6.74719C17.6926 6.35995 17.5044 5.98672 17.2907 5.63012L16.433 6.14423ZM17.491 10.368C17.473 10.7344 17.428 11.1004 17.3559 11.4632C17.2837 11.8259 17.1852 12.1813 17.0616 12.5267L18.0031 12.8636C18.1432 12.4721 18.2549 12.0694 18.3367 11.6583C18.4184 11.2472 18.4694 10.8323 18.4898 10.4171L17.491 10.368Z"
        fill="currentColor"
      />
    </svg>
  ),
  angle: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 14L10 14H5.00001H4.0495L4.58799 13.2168L7.33799 9.21675L10.088 5.21674L10.912 5.78326L8.45436 9.35807C9.07972 9.78751 9.54479 10.2461 9.87084 10.8329C10.2065 11.437 10.3723 12.1375 10.4598 13H15V14ZM9.45406 13C9.37153 12.2592 9.23025 11.739 8.99671 11.3186C8.7674 10.9059 8.42873 10.5535 7.88782 10.1821L5.95053 13L9.45406 13Z"
        fill="currentColor"
      />
    </svg>
  ),
  arrowDown: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 17.7071L9.64648 17.3535L6.14648 13.8535L6.85359 13.1464L9.50004 15.7929V2.99997H10.5V15.7929L13.1465 13.1464L13.8536 13.8535L10.3536 17.3535L10 17.7071Z"
        fill="currentColor"
      />
    </svg>
  ),
  arrowLeft: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.29291 10L2.64646 9.64645L6.14646 6.14645L6.85357 6.85356L4.20712 9.50001L17 9.50001V10.5L4.20712 10.5L6.85357 13.1465L6.14646 13.8536L2.64646 10.3536L2.29291 10Z"
        fill="currentColor"
      />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7071 10L17.3536 10.3536L13.8536 13.8536L13.1464 13.1465L15.7929 10.5H3V9.50001H15.7929L13.1464 6.85356L13.8536 6.14645L17.3536 9.64645L17.7071 10Z"
        fill="currentColor"
      />
    </svg>
  ),
  arrowUp: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2.29288L10.3536 2.64643L13.8536 6.14643L13.1465 6.85354L10.5 4.20709V17H9.50004V4.20709L6.85359 6.85354L6.14648 6.14643L9.64648 2.64643L10 2.29288Z"
        fill="currentColor"
      />
    </svg>
  ),
  checkmark: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.29956 13.5388L13.9537 6L14.7537 6.6L8.75367 14.6L8.00012 14.6536L5 11.6536L5.70709 10.9465L8.29956 13.5388Z"
        fill="currentColor"
      />
    </svg>
  ),
  clipboardCheckmark: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 3H7L13 3L13.5 3V3.5V4.00001L15.5 4.00002L16 4.00002V4.50002V10.0351C15.6905 9.85609 15.3548 9.71733 15 9.62602V5.00002L13.5 5.00001V6.50001V7.00001L13 7.00001L7 7.00001L6.5 7.00001V6.50001V5.00001L5 5.00001V16H10.8773C11.2024 16.4055 11.6047 16.7463 12.062 17H4.5H4V16.5V4.50001V4.00001L4.5 4.00001L6.5 4.00001V3.5V3ZM15.938 17C15.9588 16.9885 15.9794 16.9768 16 16.9649V17H15.938ZM7.5 4V4.50001V6.00001L12.5 6.00001V4.50001V4L7.5 4ZM13 9H7V8H13V9ZM15.6855 11.5L13.2101 14.8005L12.2071 13.7975L11.5 14.5046L12.9107 15.9153L13.6642 15.8617L16.4855 12.1L15.6855 11.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  clipboardPlus: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 3H7L13 3L13.5 3V3.5V4.00001L15.5 4.00002L16 4.00002V4.50002V10.0351C15.6905 9.85609 15.3548 9.71733 15 9.62602V5.00002L13.5 5.00001V6.50001V7.00001L13 7.00001L7 7.00001L6.5 7.00001V6.50001V5.00001L5 5.00001V16H10.8773C11.2024 16.4055 11.6047 16.7463 12.062 17H4.5H4V16.5V4.50001V4.00001L4.5 4.00001L6.5 4.00001V3.5V3ZM15.938 17C15.9588 16.9885 15.9794 16.9768 16 16.9649V17H15.938ZM7.5 4V4.50001V6.00001L12.5 6.00001V4.50001V4L7.5 4ZM13 9H7V8H13V9ZM13.5 11V13H11.5V14H13.5V16H14.5V14H16.5V13H14.5V11H13.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.2929 10L6.46448 7.17158L7.17158 6.46448L10 9.2929L12.8284 6.46448L13.5355 7.17158L10.7071 10L13.5355 12.8284L12.8284 13.5355L10 10.7071L7.17158 13.5355L6.46448 12.8284L9.2929 10Z"
        fill="currentColor"
      />
    </svg>
  ),
  dimension: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.6455 3.6455L14 2V5.291L5.291 14H2L6 18V14.7052L14.7052 6H18L16.3526 4.35261L16.3546 4.35065L15.6475 3.64354L15.6455 3.6455Z"
        fill="currentColor"
      />
    </svg>
  ),
  equal: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 8.78V7H14.52V8.78H5ZM5 13.02V11.24H14.52V13.02H5Z"
        fill="currentColor"
      />
    </svg>
  ),
  exclamationMark: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.76391 11.6597L9.3633 7.91112V5.00671H10.6224V7.91112L10.2217 11.6597H9.76391ZM9.99283 15.1221C9.60176 15.1221 9.32515 15.041 9.163 14.8788C9.01039 14.7167 8.93408 14.5116 8.93408 14.2636V14.0061C8.93408 13.7581 9.01039 13.553 9.163 13.3909C9.32515 13.2287 9.60176 13.1476 9.99283 13.1476C10.3839 13.1476 10.6557 13.2287 10.8084 13.3909C10.9705 13.553 11.0516 13.7581 11.0516 14.0061V14.2636C11.0516 14.5116 10.9705 14.7167 10.8084 14.8788C10.6557 15.041 10.3839 15.1221 9.99283 15.1221Z"
        fill="currentColor"
      />
    </svg>
  ),
  exportFile: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3H4.5H11H11.2071L11.3536 3.14645L15.8536 7.64646L16 7.7929V8.00001V11.3773C15.6992 11.1362 15.3628 10.9376 15 10.7908V8.50001H11H10.5V8.00001V4H5V16H9.79076C9.93763 16.3628 10.1362 16.6992 10.3773 17H4.5H4V16.5V3.5V3ZM11.5 4.70711L14.2929 7.50001H11.5V4.70711ZM16.3904 14.1877L14.3904 11.6877L13.6096 12.3124L14.9597 14H11V15H14.9597L13.6096 16.6877L14.3904 17.3124L16.3904 14.8124L16.6403 14.5L16.3904 14.1877Z"
        fill="currentColor"
      />
    </svg>
  ),
  extrude: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3L10.3536 3.35355L12.3536 5.35355L11.6465 6.06066L10.5 4.91421V11.5854C11.0826 11.7913 11.5 12.3469 11.5 13C11.5 13.8284 10.8284 14.5 10 14.5C9.17157 14.5 8.5 13.8284 8.5 13C8.5 12.3469 8.91741 11.7913 9.5 11.5854V4.91421L8.35356 6.06066L7.64645 5.35355L9.64645 3.35355L10 3ZM1.95887 12.3282L8 8.63644V9.80838L2.91773 12.9142L10 17.2423L17.0823 12.9142L12 9.80838V8.63644L18.0411 12.3282L19 12.9142L19 14.9683H18V13.5253L10.5 18.1087V19.9683H9.5V18.1087L2 13.5253V14.9683H1L1 12.9142L1.95887 12.3282Z"
        fill="currentColor"
      />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3H4.5H11H11.2071L11.3536 3.14645L15.8536 7.64646L16 7.7929V8.00001V16.5V17H15.5H4.5H4V16.5V3.5V3ZM5 4V16H15V8.50001H11H10.5V8.00001V4H5ZM11.5 4.70711L14.2929 7.50001H11.5V4.70711Z"
        fill="currentColor"
      />
    </svg>
  ),
  filePlus: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3H4.5H11H11.2071L11.3536 3.14645L15.8536 7.64646L16 7.7929V8.00001V11.3773C15.6992 11.1362 15.3628 10.9376 15 10.7908V8.50001H11H10.5V8.00001V4H5V16H9.79076C9.93763 16.3628 10.1362 16.6992 10.3773 17H4.5H4V16.5V3.5V3ZM11.5 4.70711L14.2929 7.50001H11.5V4.70711ZM13 12V14H11V15H13V17H14V15H16V14H14V12H13Z"
        fill="currentColor"
      />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 3.5H4H7H7.16667L7.3 3.6L9.16667 5H16H16.5V5.5V7.5V16V16.5H16H4H3.5V16V7.5V4V3.5ZM4.5 4.5V7H15.5V6H9H8.83333L8.7 5.9L6.83333 4.5H4.5ZM15.5 8H4.5V15.5H15.5V8Z"
        fill="currentColor"
      />
    </svg>
  ),
  folderPlus: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 3.5H4H7H7.16667L7.3 3.6L9.16667 5H16H16.5V5.5V7.5V10.3773C16.1992 10.1362 15.8628 9.93763 15.5 9.79076V8H4.5V15.5H10.5351C10.7529 15.8764 11.0302 16.2141 11.3542 16.5H4H3.5V16V7.5V4V3.5ZM4.5 4.5V7H15.5V6H9H8.83333L8.7 5.9L6.83333 4.5H4.5ZM13.5 11V13H11.5V14H13.5V16H14.5V14H16.5V13H14.5V11H13.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.61477 3.0884L5.87402 4.67077L6.50004 5.75505L5.25004 7.92011H4.0047V11.07H5.25004L6.50004 13.2351L5.86973 14.3268L8.62776 15.9191L9.24503 14.85H11.745L12.3647 15.9234L15.1416 14.3202L14.5151 13.2351L15.7651 11.07H16.9951V7.92011H15.7651L14.5151 5.75505L15.1373 4.67741L12.3778 3.08423L11.7451 4.18012H9.24508L8.61477 3.0884ZM10.4999 13C12.4329 13 13.9999 11.433 13.9999 9.50003C13.9999 7.56703 12.4329 6.00003 10.4999 6.00003C8.56687 6.00003 6.99986 7.56703 6.99986 9.50003C6.99986 11.433 8.56687 13 10.4999 13Z"
        fill="currentColor"
      />
    </svg>
  ),
  horizontal: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 9.5H16V11.5H4V9.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  horizontalDash: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 10.5H6V9.5H14V10.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  kcl: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40 0H0V40H40V0ZM7.34715 27.2143V15.6577L2.976 15.987V36.7949H7.34715V32.0645L8.00582 31.5256C8.24533 31.326 8.47487 31.1264 8.69442 30.9268L12.1075 36.7949H17.0475C16.1893 35.3978 15.311 33.9906 14.4128 32.5735C13.5346 31.1563 12.6664 29.7392 11.8081 28.3221L15.8499 24.9389C15.4308 24.4399 15.0017 23.931 14.5625 23.412L13.3051 21.8552L7.34715 27.2143ZM22.2581 26.6754C22.8769 25.9169 23.6753 25.5377 24.6533 25.5377C25.272 25.5377 25.8309 25.6175 26.3299 25.7772C26.8289 25.9169 27.4177 26.1465 28.0963 26.4658L29.3238 23.3521C28.5853 22.7933 27.7371 22.4041 26.779 22.1845C25.8409 21.9649 25.0625 21.8552 24.4437 21.8552C22.0885 21.8552 20.2223 22.5537 18.845 23.9509C17.4878 25.3281 16.8092 27.1944 16.8092 29.5496C16.8092 31.9048 17.4878 33.7611 18.845 35.1183C20.2223 36.4756 22.0885 37.1542 24.4437 37.1542C25.0625 37.1542 25.8509 37.0444 26.8089 36.8249C27.767 36.6053 28.6053 36.2161 29.3238 35.6572L28.0963 32.5435C27.4177 32.8629 26.8289 33.0924 26.3299 33.2321C25.8309 33.3718 25.272 33.4417 24.6533 33.4417C23.6753 33.4417 22.8769 33.0924 22.2581 32.3938C21.6594 31.6753 21.36 30.7272 21.36 29.5496C21.36 28.372 21.6594 27.4139 22.2581 26.6754ZM36.2796 36.7949V15.6577L31.9085 15.987V36.7949H36.2796Z"
        fill="currentColor"
      />
    </svg>
  ),
  line: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5 6C16.3284 6 17 5.32843 17 4.5C17 3.67157 16.3284 3 15.5 3C14.6716 3 14 3.67157 14 4.5C14 4.73107 14.0522 4.94993 14.1456 5.14543L5.14543 14.1456C4.94993 14.0522 4.73107 14 4.5 14C3.67157 14 3 14.6716 3 15.5C3 16.3284 3.67157 17 4.5 17C5.32843 17 6 16.3284 6 15.5C6 15.2679 5.94729 15.0482 5.8532 14.852L14.852 5.8532C15.0482 5.94729 15.2679 6 15.5 6Z"
        fill="currentColor"
      />
    </svg>
  ),
  'make-variable': (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.07178 6.57735L9.99998 3.1547L15.9282 6.57735V13.4227L9.99998 16.8453L4.07178 13.4227V6.57735ZM9.99998 2L16.9282 6V14L9.99998 18L3.07178 14V6L9.99998 2ZM9.45068 6.854C9.20802 6.798 8.97468 6.78867 8.75068 6.826C8.39602 6.90067 8.06468 7.04533 7.75668 7.26C7.73802 7.26933 7.72402 7.27867 7.71468 7.288C7.45335 7.484 7.24802 7.694 7.09868 7.918C6.96802 8.09533 6.86068 8.282 6.77668 8.478C6.69268 8.65533 6.63668 8.814 6.60868 8.954C6.60868 9.00067 6.62268 9.038 6.65068 9.066L6.69268 9.108H6.95868C7.13602 9.108 7.23402 9.09867 7.25268 9.08C7.28068 9.052 7.30868 8.982 7.33668 8.87C7.45802 8.52467 7.65402 8.212 7.92468 7.932C8.13002 7.72667 8.36802 7.58667 8.63868 7.512C8.83468 7.456 9.02602 7.456 9.21268 7.512C9.40868 7.57733 9.53002 7.68467 9.57668 7.834C9.62335 7.96467 9.61402 8.198 9.54868 8.534L8.77868 11.614C8.65735 11.9593 8.47535 12.216 8.23268 12.384C8.10202 12.4587 7.97602 12.4913 7.85468 12.482C7.68668 12.482 7.53735 12.4307 7.40668 12.328L7.36468 12.286L7.42068 12.272C7.50468 12.244 7.57002 12.216 7.61668 12.188C7.93402 12.02 8.10668 11.7493 8.13468 11.376C8.15335 11.1053 8.05535 10.9187 7.84068 10.816C7.60735 10.6853 7.34135 10.69 7.04268 10.83C6.73468 10.9793 6.54802 11.2547 6.48268 11.656C6.45468 11.8893 6.47335 12.1087 6.53868 12.314C6.56668 12.4073 6.60868 12.4913 6.66468 12.566C6.92602 12.986 7.32268 13.182 7.85468 13.154C8.31202 13.126 8.72268 12.8787 9.08668 12.412L9.12868 12.37L9.21268 12.496C9.44602 12.8133 9.80068 13.0233 10.2767 13.126C10.5474 13.1633 10.79 13.1633 11.0047 13.126C11.6954 12.9767 12.2507 12.58 12.6707 11.936C12.6894 11.9173 12.7034 11.894 12.7127 11.866C12.9553 11.474 13.0767 11.18 13.0767 10.984C13.0767 10.9373 13.0674 10.9047 13.0487 10.886C13.0207 10.8673 12.918 10.858 12.7407 10.858C12.61 10.858 12.526 10.8627 12.4887 10.872C12.442 10.8813 12.4047 10.9327 12.3767 11.026C12.2834 11.3807 12.092 11.7073 11.8027 12.006C11.56 12.23 11.3174 12.3793 11.0747 12.454C11.0094 12.4727 10.9067 12.482 10.7667 12.482C10.6174 12.482 10.5194 12.4727 10.4727 12.454C10.314 12.398 10.1974 12.3 10.1227 12.16C10.0667 12.0573 10.062 11.8613 10.1087 11.572C10.1087 11.5347 10.132 11.4367 10.1787 11.278C10.58 9.542 10.8274 8.55733 10.9207 8.324C11.0887 7.88533 11.3127 7.61467 11.5927 7.512C11.6114 7.50267 11.63 7.498 11.6487 7.498C11.8914 7.43267 12.0967 7.47467 12.2647 7.624L12.3207 7.68L12.2087 7.722C11.8354 7.85267 11.6207 8.128 11.5647 8.548C11.5367 8.76267 11.5927 8.94 11.7327 9.08C11.77 9.11733 11.8167 9.15 11.8727 9.178C12.1714 9.32733 12.4887 9.28067 12.8247 9.038C12.9367 8.954 13.03 8.83267 13.1047 8.674C13.282 8.26333 13.2774 7.87133 13.0907 7.498C12.9787 7.26467 12.7874 7.078 12.5167 6.938C12.162 6.77933 11.8074 6.76533 11.4527 6.896C11.1447 7.01733 10.8787 7.20867 10.6547 7.47L10.5707 7.582C10.552 7.582 10.524 7.554 10.4867 7.498C10.2627 7.17133 9.91735 6.95667 9.45068 6.854Z"
        fill="currentColor"
      />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 6H5V5H15V6ZM15 10.5H5V9.5H15V10.5ZM5 15H15V14H5V15Z"
        fill="currentColor"
      />
    </svg>
  ),
  move: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2.29289L10.3536 2.64645L12.3536 4.64645L11.6465 5.35355L10.5 4.20711V8V9.50001H12L15.7929 9.50001L14.6465 8.35356L15.3536 7.64645L17.3536 9.64645L17.7071 10L17.3536 10.3536L15.3536 12.3536L14.6465 11.6465L15.7929 10.5H12H10.5V12V15.7929L11.6465 14.6464L12.3536 15.3536L10.3536 17.3536L10 17.7071L9.64645 17.3536L7.64645 15.3536L8.35356 14.6464L9.50001 15.7929V12V10.5H8.00001H4.20712L5.35357 11.6465L4.64646 12.3536L2.64646 10.3536L2.29291 10L2.64646 9.64645L4.64646 7.64645L5.35357 8.35356L4.20712 9.50001H8.00001H9.50001V8V4.20711L8.35356 5.35355L7.64645 4.64645L9.64645 2.64645L10 2.29289Z"
        fill="currentColor"
      />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9.64741C17.1925 8.24871 16.0344 7.08457 14.6399 6.26971C13.2455 5.45486 11.6628 5.01742 10.0478 5.00051C8.4328 4.9836 6.84127 5.38779 5.43006 6.17326C4.01884 6.95873 2.83666 8.09837 2 9.47985L2.76881 9.94546C3.52456 8.69756 4.59243 7.66813 5.86718 6.95862C7.14193 6.2491 8.57955 5.88399 10.0384 5.89927C11.4972 5.91455 12.9269 6.30968 14.1865 7.04574C15.4461 7.7818 16.4922 8.83337 17.2216 10.0968L18 9.64741ZM15.2155 11.0953C14.6772 10.1628 13.9051 9.3867 12.9755 8.84347C12.0459 8.30023 10.9907 8.00861 9.91406 7.99733C8.8374 7.98606 7.77638 8.25552 6.83557 8.77917C5.89476 9.30281 5.10664 10.0626 4.54887 10.9836L5.34391 11.4651C5.81802 10.6822 6.48792 10.0364 7.28761 9.59132C8.0873 9.14622 8.98916 8.91718 9.90432 8.92676C10.8195 8.93635 11.7164 9.18423 12.5065 9.64598C13.2967 10.1077 13.953 10.7674 14.4106 11.56L15.2155 11.0953ZM10 14C10.8284 14 11.5 13.3284 11.5 12.5C11.5 11.6716 10.8284 11 10 11C9.17157 11 8.5 11.6716 8.5 12.5C8.5 13.3284 9.17157 14 10 14Z"
        fill="currentColor"
      />
    </svg>
  ),
  networkCrossedOut: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.35352 5.39647L14.253 15.296L14.9601 14.5889L5.06062 4.68936L4.35352 5.39647ZM12.5065 9.64599C11.9609 9.32713 11.3643 9.11025 10.746 9.00341L9.74058 7.99796C9.79835 7.99694 9.85618 7.99674 9.91406 7.99735C10.9907 8.00862 12.0459 8.30025 12.9755 8.84348C13.9051 9.38672 14.6772 10.1628 15.2155 11.0953L14.4106 11.56C13.953 10.7674 13.2967 10.1077 12.5065 9.64599ZM6.48788 8.98789L7.16295 9.66297C6.41824 10.1045 5.79317 10.7233 5.34391 11.4651L4.54887 10.9836C5.03646 10.1785 5.70009 9.49656 6.48788 8.98789ZM10.0384 5.89928C9.3134 5.89169 8.59366 5.97804 7.89655 6.15392L7.16867 5.42605C8.09637 5.13507 9.06776 4.99026 10.0478 5.00052C11.6628 5.01744 13.2455 5.45488 14.6399 6.26973C16.0344 7.08458 17.1925 8.24872 18 9.64742L17.2216 10.0968C16.4922 8.83338 15.4461 7.78181 14.1865 7.04575C12.9269 6.3097 11.4972 5.91456 10.0384 5.89928ZM5.00782 7.50783L4.36522 6.86524C3.42033 7.57557 2.61639 8.46208 2 9.47986L2.76881 9.94547C3.34775 8.98952 4.10986 8.16177 5.00782 7.50783ZM10 14C10.4142 14 10.7892 13.8321 11.0607 13.5607L8.93934 11.4394C8.66789 11.7108 8.5 12.0858 8.5 12.5C8.5 13.3284 9.17157 14 10 14Z"
        fill="currentColor"
      />
    </svg>
  ),
  parallel: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16V4H6V16H8ZM14 16V4H12V16H14Z"
        fill="currentColor"
      />
    </svg>
  ),
  person: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6C12 7.10457 11.1046 8 10 8C8.89543 8 8 7.10457 8 6C8 4.89543 8.89543 4 10 4C11.1046 4 12 4.89543 12 6ZM13 6C13 7.65685 11.6569 9 10 9C8.34315 9 7 7.65685 7 6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6ZM5 12V11L9 10H11L15 11V12C15 14.7614 12.7614 17 10 17C7.23858 17 5 14.7614 5 12ZM6 11.7808L9.12311 11H10.8769L14 11.7808V12C14 14.2091 12.2091 16 10 16C7.79086 16 6 14.2091 6 12V11.7808Z"
        fill="currentColor"
      />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 9.5V5.5H10.5V9.5H14.5V10.5H10.5V14.5H9.5V10.5H5.5V9.5H9.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  questionMark: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.12005 11.9172V9.67093C9.94034 9.63278 10.5842 9.45632 11.0515 9.14156C11.5189 8.81725 11.7526 8.3308 11.7526 7.6822V7.48189C11.7526 6.94775 11.5905 6.54714 11.2662 6.28007C10.9514 6.013 10.5174 5.87946 9.96419 5.87946C9.39189 5.87946 8.93405 6.03685 8.59067 6.35161C8.2473 6.66637 8.00884 7.06698 7.8753 7.55343L6.80225 7.15282C6.89763 6.83806 7.03116 6.54237 7.20285 6.26576C7.37454 5.97962 7.58915 5.73162 7.84669 5.52178C8.11376 5.31194 8.42375 5.14502 8.77667 5.02102C9.13912 4.89702 9.54927 4.83502 10.0071 4.83502C10.4649 4.83502 10.8751 4.90179 11.2375 5.03533C11.6095 5.15932 11.9243 5.34055 12.1818 5.57901C12.4394 5.80793 12.6397 6.08931 12.7827 6.42315C12.9258 6.75699 12.9974 7.12898 12.9974 7.53912C12.9974 7.98742 12.9163 8.38326 12.7541 8.72664C12.592 9.06048 12.3821 9.34663 12.1246 9.58508C11.8671 9.82354 11.5714 10.0191 11.2375 10.1717C10.9132 10.3148 10.5842 10.4149 10.2503 10.4721V11.9172H9.12005ZM9.73527 15.1221C9.3442 15.1221 9.06759 15.041 8.90544 14.8788C8.75282 14.7167 8.67652 14.5116 8.67652 14.2636V14.0061C8.67652 13.7581 8.75282 13.553 8.90544 13.3909C9.06759 13.2287 9.3442 13.1476 9.73527 13.1476C10.1263 13.1476 10.3982 13.2287 10.5508 13.3909C10.7129 13.553 10.794 13.7581 10.794 14.0061V14.2636C10.794 14.5116 10.7129 14.7167 10.5508 14.8788C10.3982 15.041 10.1263 15.1221 9.73527 15.1221Z"
        fill="currentColor"
      />
    </svg>
  ),
  rectangle: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 5H4V15H16V5ZM4 4H3V5V15V16H4H16H17V15V5V4H16H4Z"
        fill="currentColor"
      />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.93434 4.43959L9.4014 4.26111L14.0251 2.49432L14.382 3.42845L11.5647 4.50499L10.5648 4.51221C10.8323 4.53935 11.0173 4.58539 11.2161 4.63484C11.2179 4.63528 11.2197 4.63572 11.2214 4.63616L11.2195 4.6369C11.8713 4.78513 12.4941 5.05172 13.0556 5.42692C13.9601 6.03127 14.6651 6.89025 15.0813 7.89524C15.4976 8.90024 15.6065 10.0061 15.3943 11.073C15.1821 12.1399 14.6583 13.1199 13.8891 13.8891C13.1199 14.6583 12.1399 15.1821 11.073 15.3943C10.0061 15.6065 8.90023 15.4976 7.89524 15.0813C6.89025 14.6651 6.03126 13.9601 5.42692 13.0556C4.82257 12.1512 4.5 11.0878 4.5 10H5.5C5.5 10.89 5.76392 11.76 6.25839 12.5001C6.75285 13.2401 7.45566 13.8169 8.27792 14.1575C9.10019 14.4981 10.005 14.5872 10.8779 14.4135C11.7508 14.2399 12.5526 13.8113 13.182 13.182C13.8113 12.5526 14.2399 11.7508 14.4135 10.8779C14.5872 10.005 14.4981 9.10019 14.1575 8.27793C13.8169 7.45566 13.2401 6.75286 12.5001 6.25839C11.8763 5.84159 11.1601 5.5886 10.4175 5.51941L11.8137 9.17339L10.8796 9.53033L9.11281 4.90665L8.93434 4.43959Z"
        fill="currentColor"
      />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.016 9.00482C14.016 10.662 12.6731 12.0048 11.0172 12.0048C9.3613 12.0048 8.01841 10.662 8.01841 9.00482C8.01841 7.34768 9.3613 6.00482 11.0172 6.00482C12.6731 6.00482 14.016 7.34768 14.016 9.00482ZM15.016 9.00482C15.016 11.214 13.2257 13.0048 11.0172 13.0048C10.082 13.0048 9.22178 12.6837 8.54074 12.1456L5.6912 14.9952L4.98409 14.2881L7.83921 11.433C7.32431 10.7597 7.01841 9.91799 7.01841 9.00482C7.01841 6.79568 8.80873 5.00482 11.0172 5.00482C13.2257 5.00482 15.016 6.79568 15.016 9.00482Z"
        fill="currentColor"
      />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 5.5C8 5.77614 7.77614 6 7.5 6C7.22386 6 7 5.77614 7 5.5C7 5.22386 7.22386 5 7.5 5C7.77614 5 8 5.22386 8 5.5ZM6.08535 6C6.29127 6.5826 6.84689 7 7.5 7C8.32843 7 9 6.32843 9 5.5C9 4.67157 8.32843 4 7.5 4C6.84689 4 6.29127 4.4174 6.08535 5H5V6H6.08535ZM15 6H9.94999C9.98278 5.83844 10 5.67123 10 5.5C10 5.32877 9.98278 5.16155 9.94999 5H15V6ZM11 14.5C11 14.7761 10.7761 15 10.5 15C10.2239 15 10 14.7761 10 14.5C10 14.2239 10.2239 14 10.5 14C10.7761 14 11 14.2239 11 14.5ZM9.08535 15C9.29127 15.5826 9.84689 16 10.5 16C11.3284 16 12 15.3284 12 14.5C12 13.6716 11.3284 13 10.5 13C9.84689 13 9.29127 13.4174 9.08535 14H5V15H9.08535ZM15 15H12.95C12.9828 14.8384 13 14.6712 13 14.5C13 14.3288 12.9828 14.1616 12.95 14H15V15ZM11.5 10.5C11.7761 10.5 12 10.2761 12 10C12 9.72386 11.7761 9.5 11.5 9.5C11.2239 9.5 11 9.72386 11 10C11 10.2761 11.2239 10.5 11.5 10.5ZM11.5 8.5C12.1531 8.5 12.7087 8.9174 12.9146 9.5H15V10.5H12.9146C12.7087 11.0826 12.1531 11.5 11.5 11.5C10.6716 11.5 10 10.8284 10 10C10 9.17157 10.6716 8.5 11.5 8.5ZM9.05001 10.5C9.01722 10.3384 9 10.1712 9 10C9 9.82877 9.01722 9.66155 9.05001 9.5H5V10.5H9.05001Z"
        fill="currentColor"
      />
    </svg>
  ),
  sketch: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.8037 13.4035L15.5509 14.1635L16.3682 16.8386L13.5521 16.1346L12.8186 15.3885L14.8037 13.4035ZM14.1025 12.6903L12.1175 14.6754L3.48609 5.89624C2.94588 5.34678 2.94963 4.46456 3.49448 3.91971C4.04591 3.36828 4.94112 3.37208 5.48786 3.92817L14.1025 12.6903ZM6.20094 3.22709L16.4357 13.6371L17.5003 17.1216L17.8412 18.2376L16.7091 17.9546L13.0364 17.0364L2.77301 6.59732C1.84793 5.6564 1.85434 4.14564 2.78737 3.2126C3.73167 2.2683 5.26468 2.27481 6.20094 3.22709Z"
        fill="currentColor"
      />
    </svg>
  ),
  'three-dots': (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 10C6.5 10.8284 5.82843 11.5 5 11.5C4.17157 11.5 3.5 10.8284 3.5 10C3.5 9.17157 4.17157 8.5 5 8.5C5.82843 8.5 6.5 9.17157 6.5 10ZM11.5 10C11.5 10.8284 10.8284 11.5 10 11.5C9.17157 11.5 8.5 10.8284 8.5 10C8.5 9.17157 9.17157 8.5 10 8.5C10.8284 8.5 11.5 9.17157 11.5 10ZM15 11.5C15.8284 11.5 16.5 10.8284 16.5 10C16.5 9.17157 15.8284 8.5 15 8.5C14.1716 8.5 13.5 9.17157 13.5 10C13.5 10.8284 14.1716 11.5 15 11.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  vertical: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 4V16H9V4H11Z"
        fill="currentColor"
      />
    </svg>
  ),
  xAbsolute: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 16V4H5L5 16H4ZM8.75069 6.82599C8.97469 6.78866 9.20803 6.79799 9.45069 6.85399C9.91736 6.95666 10.2627 7.17132 10.4867 7.49799C10.524 7.55399 10.552 7.58199 10.5707 7.58199L10.6547 7.46999C10.8787 7.20866 11.1447 7.01732 11.4527 6.89599C11.8074 6.76532 12.162 6.77932 12.5167 6.93799C12.7874 7.07799 12.9787 7.26466 13.0907 7.49799C13.2774 7.87132 13.282 8.26332 13.1047 8.67399C13.03 8.83266 12.9367 8.95399 12.8247 9.03799C12.4887 9.28066 12.1714 9.32732 11.8727 9.17799C11.8167 9.14999 11.77 9.11732 11.7327 9.07999C11.5927 8.93999 11.5367 8.76266 11.5647 8.54799C11.6207 8.12799 11.8354 7.85266 12.2087 7.72199L12.3207 7.67999L12.2647 7.62399C12.0967 7.47466 11.8914 7.43266 11.6487 7.49799C11.63 7.49799 11.6114 7.50266 11.5927 7.51199C11.3127 7.61466 11.0887 7.88532 10.9207 8.32399C10.8274 8.55732 10.58 9.54199 10.1787 11.278C10.132 11.4367 10.1087 11.5347 10.1087 11.572C10.062 11.8613 10.0667 12.0573 10.1227 12.16C10.1974 12.3 10.314 12.398 10.4727 12.454C10.5194 12.4727 10.6174 12.482 10.7667 12.482C10.9067 12.482 11.0094 12.4727 11.0747 12.454C11.3174 12.3793 11.56 12.23 11.8027 12.006C12.092 11.7073 12.2834 11.3807 12.3767 11.026C12.4047 10.9327 12.442 10.8813 12.4887 10.872C12.526 10.8627 12.61 10.858 12.7407 10.858C12.918 10.858 13.0207 10.8673 13.0487 10.886C13.0674 10.9047 13.0767 10.9373 13.0767 10.984C13.0767 11.18 12.9554 11.474 12.7127 11.866C12.7034 11.894 12.6894 11.9173 12.6707 11.936C12.2507 12.58 11.6954 12.9767 11.0047 13.126C10.79 13.1633 10.5474 13.1633 10.2767 13.126C9.80069 13.0233 9.44603 12.8133 9.21269 12.496L9.12869 12.37L9.08669 12.412C8.72269 12.8787 8.31203 13.126 7.85469 13.154C7.32269 13.182 6.92603 12.986 6.66469 12.566C6.60869 12.4913 6.56669 12.4073 6.53869 12.314C6.47336 12.1087 6.45469 11.8893 6.48269 11.656C6.54803 11.2547 6.73469 10.9793 7.04269 10.83C7.34136 10.69 7.60736 10.6853 7.84069 10.816C8.05536 10.9187 8.15336 11.1053 8.13469 11.376C8.10669 11.7493 7.93403 12.02 7.61669 12.188C7.57003 12.216 7.50469 12.244 7.42069 12.272L7.36469 12.286L7.40669 12.328C7.53736 12.4307 7.68669 12.482 7.85469 12.482C7.97603 12.4913 8.10203 12.4587 8.23269 12.384C8.47536 12.216 8.65736 11.9593 8.77869 11.614L9.54869 8.53399C9.61403 8.19799 9.62336 7.96466 9.57669 7.83399C9.53003 7.68466 9.40869 7.57732 9.21269 7.51199C9.02603 7.45599 8.83469 7.45599 8.63869 7.51199C8.36803 7.58666 8.13003 7.72666 7.92469 7.93199C7.65403 8.21199 7.45803 8.52466 7.33669 8.86999C7.30869 8.98199 7.28069 9.05199 7.25269 9.07999C7.23403 9.09866 7.13603 9.10799 6.95869 9.10799H6.69269L6.65069 9.06599C6.62269 9.03799 6.60869 9.00066 6.60869 8.95399C6.63669 8.81399 6.69269 8.65532 6.77669 8.47799C6.86069 8.28199 6.96803 8.09532 7.09869 7.91799C7.24803 7.69399 7.45336 7.48399 7.71469 7.28799C7.72403 7.27866 7.73803 7.26932 7.75669 7.25999C8.06469 7.04532 8.39603 6.90066 8.75069 6.82599ZM15 4L15 16H16L16 4H15Z"
        fill="currentColor"
      />
    </svg>
  ),
  xRelative: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.75069 6.82599C8.97469 6.78866 9.20803 6.79799 9.45069 6.85399C9.91736 6.95666 10.2627 7.17132 10.4867 7.49799C10.524 7.55399 10.552 7.58199 10.5707 7.58199L10.6547 7.46999C10.8787 7.20866 11.1447 7.01732 11.4527 6.89599C11.8074 6.76532 12.162 6.77932 12.5167 6.93799C12.7874 7.07799 12.9787 7.26466 13.0907 7.49799C13.2774 7.87132 13.282 8.26332 13.1047 8.67399C13.03 8.83266 12.9367 8.95399 12.8247 9.03799C12.4887 9.28066 12.1714 9.32732 11.8727 9.17799C11.8167 9.14999 11.77 9.11732 11.7327 9.07999C11.5927 8.93999 11.5367 8.76266 11.5647 8.54799C11.6207 8.12799 11.8354 7.85266 12.2087 7.72199L12.3207 7.67999L12.2647 7.62399C12.0967 7.47466 11.8914 7.43266 11.6487 7.49799C11.63 7.49799 11.6114 7.50266 11.5927 7.51199C11.3127 7.61466 11.0887 7.88532 10.9207 8.32399C10.8274 8.55732 10.58 9.54199 10.1787 11.278C10.132 11.4367 10.1087 11.5347 10.1087 11.572C10.062 11.8613 10.0667 12.0573 10.1227 12.16C10.1974 12.3 10.314 12.398 10.4727 12.454C10.5194 12.4727 10.6174 12.482 10.7667 12.482C10.9067 12.482 11.0094 12.4727 11.0747 12.454C11.3174 12.3793 11.56 12.23 11.8027 12.006C12.092 11.7073 12.2834 11.3807 12.3767 11.026C12.4047 10.9327 12.442 10.8813 12.4887 10.872C12.526 10.8627 12.61 10.858 12.7407 10.858C12.918 10.858 13.0207 10.8673 13.0487 10.886C13.0674 10.9047 13.0767 10.9373 13.0767 10.984C13.0767 11.18 12.9554 11.474 12.7127 11.866C12.7034 11.894 12.6894 11.9173 12.6707 11.936C12.2507 12.58 11.6954 12.9767 11.0047 13.126C10.79 13.1633 10.5474 13.1633 10.2767 13.126C9.80069 13.0233 9.44603 12.8133 9.21269 12.496L9.12869 12.37L9.08669 12.412C8.72269 12.8787 8.31203 13.126 7.85469 13.154C7.32269 13.182 6.92603 12.986 6.66469 12.566C6.60869 12.4913 6.56669 12.4073 6.53869 12.314C6.47336 12.1087 6.45469 11.8893 6.48269 11.656C6.54803 11.2547 6.73469 10.9793 7.04269 10.83C7.34136 10.69 7.60736 10.6853 7.84069 10.816C8.05536 10.9187 8.15336 11.1053 8.13469 11.376C8.10669 11.7493 7.93403 12.02 7.61669 12.188C7.57003 12.216 7.50469 12.244 7.42069 12.272L7.36469 12.286L7.40669 12.328C7.53736 12.4307 7.68669 12.482 7.85469 12.482C7.97603 12.4913 8.10203 12.4587 8.23269 12.384C8.47536 12.216 8.65736 11.9593 8.77869 11.614L9.54869 8.53399C9.61403 8.19799 9.62336 7.96466 9.57669 7.83399C9.53003 7.68466 9.40869 7.57732 9.21269 7.51199C9.02603 7.45599 8.83469 7.45599 8.63869 7.51199C8.36803 7.58666 8.13003 7.72666 7.92469 7.93199C7.65403 8.21199 7.45803 8.52466 7.33669 8.86999C7.30869 8.98199 7.28069 9.05199 7.25269 9.07999C7.23403 9.09866 7.13603 9.10799 6.95869 9.10799H6.69269L6.65069 9.06599C6.62269 9.03799 6.60869 9.00066 6.60869 8.95399C6.63669 8.81399 6.69269 8.65532 6.77669 8.47799C6.86069 8.28199 6.96803 8.09532 7.09869 7.91799C7.24803 7.69399 7.45336 7.48399 7.71469 7.28799C7.72403 7.27866 7.73803 7.26932 7.75669 7.25999C8.06469 7.04532 8.39603 6.90066 8.75069 6.82599Z"
        fill="currentColor"
      />
    </svg>
  ),
  yAbsolute: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 16V4H5L5 16H4ZM7.92469 6.83999C8.11136 6.79332 8.33069 6.79799 8.58269 6.85399C9.05869 6.98466 9.36203 7.26932 9.49269 7.70799C9.53003 7.86666 9.53003 8.06732 9.49269 8.30999C9.47403 8.37532 9.40403 8.56666 9.28269 8.88399C8.94669 9.78932 8.72736 10.4847 8.62469 10.97C8.52203 11.5953 8.57803 12.0293 8.79269 12.272C8.95136 12.4587 9.17536 12.5287 9.46469 12.482C9.88469 12.426 10.2534 12.174 10.5707 11.726L10.6547 11.6L11.1587 9.54199C11.5134 8.15132 11.7047 7.43266 11.7327 7.38599C11.882 7.11532 12.106 6.97532 12.4047 6.96599C12.554 6.96599 12.68 7.00799 12.7827 7.09199C12.8294 7.11066 12.8714 7.16199 12.9087 7.24599C12.9554 7.33932 12.9647 7.45599 12.9367 7.59599C12.9087 7.73599 12.6847 8.65532 12.2647 10.354C11.742 12.3887 11.49 13.3733 11.5087 13.308C11.4154 13.6067 11.2754 13.882 11.0887 14.134C10.566 14.9273 9.87536 15.4593 9.01669 15.73C8.60603 15.87 8.20469 15.912 7.81269 15.856C7.11269 15.7533 6.67403 15.436 6.49669 14.904C6.45936 14.6987 6.46403 14.5073 6.51069 14.33C6.56669 14.0967 6.68336 13.91 6.86069 13.77C7.19669 13.5273 7.51403 13.4807 7.81269 13.63C7.92469 13.6953 8.00869 13.784 8.06469 13.896C8.16736 14.12 8.14869 14.3627 8.00869 14.624C7.91536 14.8013 7.78936 14.932 7.63069 15.016L7.54669 15.072L7.61669 15.1C7.98069 15.2587 8.36336 15.2587 8.76469 15.1C9.26869 14.8947 9.68869 14.442 10.0247 13.742C10.09 13.5927 10.1507 13.4433 10.2067 13.294C10.3187 12.9673 10.3654 12.7993 10.3467 12.79C10.3374 12.79 10.3047 12.8087 10.2487 12.846C10.1087 12.93 9.95936 13 9.80069 13.056C9.28736 13.2333 8.76003 13.2007 8.21869 12.958C8.08803 12.902 7.97136 12.832 7.86869 12.748C7.44869 12.412 7.26669 11.8987 7.32269 11.208C7.36003 10.7507 7.57936 9.98066 7.98069 8.89799C7.99003 8.86066 7.99936 8.82799 8.00869 8.79999C8.13936 8.47332 8.20936 8.27732 8.21869 8.21199C8.33069 7.89466 8.34469 7.67532 8.26069 7.55399C8.22336 7.49799 8.14869 7.46999 8.03669 7.46999C7.63536 7.50732 7.30403 7.84799 7.04269 8.49199C6.99603 8.60399 6.95403 8.72532 6.91669 8.85599C6.87003 9.00532 6.83269 9.08466 6.80469 9.09399C6.79536 9.10332 6.69736 9.10799 6.51069 9.10799H6.25869L6.21669 9.06599C6.17003 9.02866 6.17469 8.93066 6.23069 8.77199C6.40803 8.17466 6.67869 7.70332 7.04269 7.35799C7.30403 7.08732 7.59803 6.91466 7.92469 6.83999ZM15 4L15 16H16L16 4H15Z"
        fill="currentColor"
      />
    </svg>
  ),
  yRelative: (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.92463 6.83998C8.1113 6.79332 8.33063 6.79798 8.58263 6.85398C9.05863 6.98465 9.36197 7.26932 9.49263 7.70798C9.52997 7.86665 9.52997 8.06732 9.49263 8.30998C9.47397 8.37532 9.40397 8.56665 9.28263 8.88399C8.94663 9.78932 8.7273 10.4847 8.62463 10.97C8.52197 11.5953 8.57797 12.0293 8.79263 12.272C8.9513 12.4587 9.1753 12.5287 9.46463 12.482C9.88463 12.426 10.2533 12.174 10.5706 11.726L10.6546 11.6L11.1586 9.54198C11.5133 8.15132 11.7046 7.43265 11.7326 7.38598C11.882 7.11532 12.106 6.97532 12.4046 6.96598C12.554 6.96598 12.68 7.00798 12.7826 7.09198C12.8293 7.11065 12.8713 7.16198 12.9086 7.24598C12.9553 7.33932 12.9646 7.45598 12.9366 7.59598C12.9086 7.73598 12.6846 8.65532 12.2646 10.354C11.742 12.3887 11.49 13.3733 11.5086 13.308C11.4153 13.6067 11.2753 13.882 11.0886 14.134C10.566 14.9273 9.8753 15.4593 9.01663 15.73C8.60597 15.87 8.20463 15.912 7.81263 15.856C7.11263 15.7533 6.67397 15.436 6.49663 14.904C6.4593 14.6987 6.46397 14.5073 6.51063 14.33C6.56663 14.0967 6.6833 13.91 6.86063 13.77C7.19663 13.5273 7.51397 13.4807 7.81263 13.63C7.92463 13.6953 8.00863 13.784 8.06463 13.896C8.1673 14.12 8.14863 14.3627 8.00863 14.624C7.9153 14.8013 7.7893 14.932 7.63063 15.016L7.54663 15.072L7.61663 15.1C7.98063 15.2587 8.3633 15.2587 8.76463 15.1C9.26863 14.8947 9.68863 14.442 10.0246 13.742C10.09 13.5927 10.1506 13.4433 10.2066 13.294C10.3186 12.9673 10.3653 12.7993 10.3466 12.79C10.3373 12.79 10.3046 12.8087 10.2486 12.846C10.1086 12.93 9.9593 13 9.80063 13.056C9.2873 13.2333 8.75997 13.2007 8.21863 12.958C8.08797 12.902 7.9713 12.832 7.86863 12.748C7.44863 12.412 7.26663 11.8987 7.32263 11.208C7.35997 10.7507 7.5793 9.98065 7.98063 8.89798C7.98997 8.86065 7.9993 8.82798 8.00863 8.79998C8.1393 8.47332 8.2093 8.27732 8.21863 8.21198C8.33063 7.89465 8.34463 7.67532 8.26063 7.55398C8.2233 7.49798 8.14863 7.46998 8.03663 7.46998C7.6353 7.50732 7.30397 7.84798 7.04263 8.49198C6.99597 8.60398 6.95397 8.72532 6.91663 8.85598C6.86997 9.00532 6.83263 9.08465 6.80463 9.09398C6.7953 9.10332 6.6973 9.10798 6.51063 9.10798H6.25863L6.21663 9.06598C6.16997 9.02865 6.17463 8.93065 6.23063 8.77198C6.40797 8.17465 6.67863 7.70332 7.04263 7.35798C7.30397 7.08732 7.59797 6.91465 7.92463 6.83998Z"
        fill="currentColor"
      />
    </svg>
  ),
} as const

export type CustomIconName = keyof typeof CustomIconMap

export const CustomIcon = ({
  name,
  ...props
}: { name: CustomIconName } & React.SVGProps<SVGSVGElement>) =>
  cloneElement(CustomIconMap[name], props)
