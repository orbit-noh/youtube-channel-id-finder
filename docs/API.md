# API

클라이언트인 웹사이트와 Work 간 요청 형식 및 응답 코드를 정리한 문서입니다.

## 요청

```http
GET /api?url=<YouTube URL>
```

YouTube URL에서 프로토콜(`http://`, `https://`)과 `www.`는 생략할 수 있습니다.

### 지원하는 URL 형식

- 채널 URL
  - `youtube.com/@handle`
  - `www.youtube.com/@handle`
  - `http://www.youtube.com/@handle`
  - `https://www.youtube.com/@handle`
- 영상 URL
  - `youtube.com/watch?v=VIDEO_ID`
  - `www.youtube.com/watch?v=VIDEO_ID`
  - `http://www.youtube.com/watch?v=VIDEO_ID`
  - `https://www.youtube.com/watch?v=VIDEO_ID`

## 응답

| HTTP status | 상황                                        | 응답 본문                  |
| ----------: | ------------------------------------------- | -------------------------- |
|       `200` | 채널 ID 추출 성공                           | `{ "channelId": "UC..." }` |
|       `400` | YouTube URL 누락 또는 처리할 수 없는 URL    | 없음                       |
|       `502` | YouTube 응답 오류 또는 Channel ID 추출 실패 | 없음                       |
|       `504` | YouTube 요청이 10초를 초과                  | 없음                       |
