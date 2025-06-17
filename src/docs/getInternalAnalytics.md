# Internal Transaction Analytics – API Reference

## Endpoint

```http
POST /dexter-report/v1/router/analytics/transaction
```

## Purpose

Returns time‑series transaction metrics for a merchant (counts, amounts, success / decline breakdown) aggregated by a chosen dimension.
Optional **filter** object lets you narrow the data further (e.g. only UPI Collect on Android).

---

## Required Parameters

| Name            | Type     | Example                 | Notes                          |
| --------------- | -------- | ----------------------- | ------------------------------ |
| `startDateTime` | `string` | `"2025‑05‑10 00:00:00"` | **UTC**, `YYYY‑MM‑DD HH:MM:SS` |
| `endDateTime`   | `string` | `"2025‑05‑31 23:59:59"` | **UTC**, inclusive             |
| `merchantId`    | `number` | `603`                   | Cashfree Merchant ID           |

## Core Parameters

| Name            | Type                  | Allowed                        | Purpose                                 |
| --------------- | --------------------- | ------------------------------ | --------------------------------------- |
| `aggregateTerm` | `string`              | see **Aggregation Terms**      | Dimension to group the results          |
| `timeRange`     | `number`              | `1`, `2`, `3`, `6`, `12`       | Number of units (hours / days) returned |
| `duration`      | `"HOUR"` \| `"DAYS"`  | –                              | Granularity of each bucket              |
| `filter`        | `object` *(optional)* | keys = string, values = string | Additional filters (see below)          |

---

## Aggregation Terms

| Term                    | Groups By                                  |
| ----------------------- | ------------------------------------------ |
| `PAYMENT_METHOD`        | UPI, Wallet, Card, NetBanking, etc.        |
| `UPI_PSP`               | UPI PSPs (GOOGLE PAY, PHONEPE, …)          |
| `NET_BANKING_BANK_NAME` | Net‑banking banks (ICICI, HDFC, …)         |
| `CARD_BANK_NAME`        | Issuing banks for cards                    |
| `CARD_VALUE`            | Card amount bands                          |
| `WALLET_PROVIDER`       | Wallet brands (Paytm Wallet, AmazonPay, …) |
| `PLATFORM`              | ANDROID, IOS, WEB, S2S                     |

> **Tip** – call once with `aggregateTerm = "PAYMENT_METHOD"` to discover which methods are present, then drill down with the corresponding `nextAggregateTerm` from the response.

---

## Filters (object properties)

| Key                 | Applies when **paymentMethod =**                                                     | Allowed Values                                                              |
| ------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `paymentMethod`     | –                                                                                    | `"UPI"`, `"NET_BANKING"`, `"CARD"`, `"WALLET"`, `"BANK_TRANSFER"`, `"CASH"` |
| `paymentMethodType` | `UPI` → `"UPI_COLLECT"`, `"UPI_INTENT"`<br> `CARD` → `"CREDIT_CARD"`, `"DEBIT_CARD"` |                                                                             |
| `platform`          | `UPI`, `NET_BANKING`, `CARD`                                                         | `"ANDROID"`, `"IOS"`, `"WEB"`, `"S2S"`                                      |
| `cardType`          | `CARD`                                                                               | `"rupay"`, `"mastercard"`, `"visa"`, `"maestro"`                            |
| `customerBank`      | `CARD`                                                                               | e.g. `"qrcode"`                                                             |
| **…any other key**  | –                                                                                    | accepted as string → string                                                 |

If `filter` is omitted or empty, no filtering is applied.

---

## Response Format (truncated)

```json
{
  "message": null,
  "currentTime": "2025-06-16 05:51:28",
  "totalCount": 651889,
  "totalSuccessfulCount": 16,
  "totalAmount": 37,
  "data": [
    {
      "category": "UPI",
      "nextAggregateTerm": "UPI_VALUE",
      "filterTerm": "paymentMethod",
      "totalCount": 651763,
      "totalSuccessfulCount": 4,
      "totalAmount": 13,
      "dataPoints": [
        {
          "startTime": "2025-05-15 00:00:00",
          "count": 80611,
          "successfulCount": 0,
          "amount": 0,
          "technicalDeclineCount": 0,
          "userDeclineCount": 0,
          "bankDeclineCount": 0
        }
        /* …one object per time bucket …*/
      ]
    }
    /* …one object per category …*/
  ]
}
```

### Field meanings

| Path                       | Description                             |
| -------------------------- | --------------------------------------- |
| `totalCount`               | Total transactions matching the request |
| `totalSuccessfulCount`     | Successful transactions                 |
| `totalAmount`              | Sum of successful amounts (₹)           |
| `data[].category`          | Value for the chosen `aggregateTerm`    |
| `data[].nextAggregateTerm` | Dimension you can drill into next       |
| `data[].dataPoints[]`      | Metrics for each hour / day bucket      |

---

## Usage Examples

### 1 – High‑level method split

```json
{
  "startDateTime": "2025-05-10 00:00:00",
  "endDateTime": "2025-05-31 23:59:59",
  "merchantId": 603,
  "aggregateTerm": "PAYMENT_METHOD",
  "timeRange": 3,
  "duration": "DAYS"
}
```

### 2 – UPI‑Collect only, by PSP

```json
{
  "startDateTime": "2025-05-10 00:00:00",
  "endDateTime": "2025-05-31 23:59:59",
  "merchantId": 603,
  "aggregateTerm": "UPI_PSP",
  "timeRange": 3,
  "duration": "DAYS",
  "filter": {
    "paymentMethod": "UPI",
    "paymentMethodType": "UPI_COLLECT"
  }
}
```

### 3 – Hourly card declines on Web

```json
{
  "startDateTime": "2025-05-12 00:00:00",
  "endDateTime": "2025-05-12 23:59:59",
  "merchantId": 603,
  "aggregateTerm": "CARD_BANK_NAME",
  "timeRange": 1,
  "duration": "HOUR",
  "filter": {
    "paymentMethod": "CARD",
    "platform": "WEB"
  }
}
```

---

## Key Points

* **Flexible filter**: provide any combination of string → string pairs.
* **nextAggregateTerm** in each category hints at valid drill‑down values.
* **Date / time are UTC** – convert from IST before calling if needed.
* **Large ranges** compress results into the requested `timeRange` buckets.
