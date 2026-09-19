# [YouTube Channel ID Finder](https://youtube-channel-id-finder.fastpath.work.dev)

유튜브 주소를 입력하면 해당 채널의 고유 ID를 찾아주는 웹사이트이다.

예를 들어 아래 URL의 `@MrBeast`는 채널 ID처럼 보이지만, 사용자가 변경할 수 있는 핸들(Handle)이다.

```text
https://www.youtube.com/@MrBeast
```

## 입력 예시

```text
youtube.com/@MrBeast
youtube.com/watch?v=0e3GPea1Tyg

https://www.youtube.com/@MrBeast
https://www.youtube.com/watch?v=0e3GPea1Tyg
```

## 출력 예시

```text
UCX6OQ3DkcsbYNE6H8uQQuVA
```

## 활용처

### RSS 피드

API 키 없이 Channel ID만으로 채널의 최신 영상 목록을 XML로 받을 수 있다.  
RSS 리더를 이용하면 별도 서버 없이도 새 영상을 확인하고 알림을 받을 수 있다.  
단, 최근 영상 약 15개만 제공한다.

```text
https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}
```

### YouTube Data API

채널의 더 다양한 정보를 조회하려면 공식 YouTube Data API를 사용할 수 있다.
이때 조회할 채널을 식별하는 값으로 Channel ID를 사용한다.

```text
https://www.googleapis.com/youtube/v3/channels?part=snippet&id={CHANNEL_ID}&key={API_KEY}
```

## Cloudflare Workers를 사용한 이유

브라우저는 보안 정책인 SOP(Same-Origin Policy)에 따라 한 origin에서 로드된 document나 script가 다른 origin의 리소스와의 상호작용 방식을 제한한다.  
예를 들어 클라이언트가 웹 브라우저이고 클라이언트 주소가 `file://`, `localhost` 일 때 youtube.com에 `fetch()` 요청을 하면, 응답 헤더에 `Access-Control-Allow-Origin` 값이 없으므로 브라우저는 이를 CORS 오류로 처리하며, JavaScript는 `fetch()`의 응답을 받을 수 없다.

이를 해결하기 위해 Cloudflare Workers를 serverless proxy로 사용한다.  
SOP와 CORS는 브라우저의 정책이므로 Worker와 YouTube 간의 서버 측 통신에는 적용되지 않는다.  
클라이언트의 요청을 받은 Worker는 YouTube에 HTML을 요청하고, 응답에서 Channel ID를 추출한 뒤 클라이언트에게 JSON 형식으로 반환한다.

## API

클라이언트인 웹사이트와 Work 간 요청 형식 및 응답 코드는 [API 문서](docs/API.md)에서 확인할 수 있다.
