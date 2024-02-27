export const columns = [
  {
    field: "date", 
    headerName: "거래일시", 
    flex: 0.7
  },
  {
    field: "summary",
    headerName: "적요",
  },
  {
    field: "person",
    headerName: "보낸분/받는분",
    flex: 0.7
  },
  {
      field: "etc",
      headerName: "비고",
      flex: 0.5,
    },
  {
    field: "place",
    headerName: "거래점",
    flex: 0.5,
  },
  {
    field: "deposit",
    headerName: "입금액",
    flex: 0.3,
    type: "number"
  },
  {
    field: "withdrawal",
    headerName: "출금액",
    flex: 0.3,
    type: "number"
  },
  {
    field: "balance",
    headerName: "잔액",
    flex: 0.3,
    type: "number"
  },
  {
    field: "memo",
    headerName: "메모",
    flex: 1,
  },
  ];