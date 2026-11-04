import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export type Place = {
  id: string;
  name: string;
  address: string;
  x: string;
  y: string;
};

export type KakaoMapHandle = {
  searchPlace: (keyword: string) => void;
  addMarker: (place: Place) => void;
};

type Props = {
  onSearchResult?: (results: Place[]) => void;
};

const KakaoMap = forwardRef(function KakaoMap(
  { onSearchResult }: Props,
  ref: React.Ref<KakaoMapHandle>
) {

  const webViewRef = useRef<WebView>(null);

  // home에서 부를 수 있는 함수들
  useImperativeHandle(ref, () => ({
    searchPlace: (keyword: string) => {
      webViewRef.current?.injectJavaScript(
        `searchPlace(${JSON.stringify(keyword)}); true;`
      );
    },
    addMarker: (place: Place) => {
      webViewRef.current?.injectJavaScript(
        `addMarker(${JSON.stringify(place)}); true;`
      );
    },
  }));

  // WebView → RN 메시지 (검색 결과)
  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SEARCH_RESULT') {
        onSearchResult?.(data.results);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.EXPO_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services"></script>
        <style>
          html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
          #map { filter: saturate(0.6) sepia(0.2); }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map;
          var places;
          var markers = [];

          kakao.maps.load(function () {
            var container = document.getElementById('map');
            map = new kakao.maps.Map(container, {
              center: new kakao.maps.LatLng(36.5, 127.8),
              level: 13
            });

            places = new kakao.maps.services.Places();
          });

          function searchPlace(keyword) {
            if (!places) return;
            places.keywordSearch(keyword, function (result, status) {
              var results = [];
              if (status === kakao.maps.services.Status.OK) {
                results = result.map(function (p) {
                  return {
                    id: p.id,
                    name: p.place_name,
                    address: p.road_address_name || p.address_name,
                    x: p.x,
                    y: p.y
                  };
                });
              }
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'SEARCH_RESULT', results: results })
              );
            });
          }

          function addMarker(place) {
            if (!map) return;
            var position = new kakao.maps.LatLng(place.y, place.x);
            var marker = new kakao.maps.Marker({ position: position, map: map });
            markers.push(marker);

            // 마커 위에 장소 이름 표시
            var info = new kakao.maps.InfoWindow({
              content: '<div style="padding:4px 8px;font-size:12px;">' + place.name + '</div>'
            });
            info.open(map, marker);

            map.setCenter(position);
            map.setLevel(5);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html, baseUrl: 'http://localhost' }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
        style={styles.webview}
      />
    </View>
  );
});

export default KakaoMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  webview: {
    flex: 1,
  },
});