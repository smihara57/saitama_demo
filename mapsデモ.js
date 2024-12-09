const apiKey = "-KRBZGweDBnkQ0vaT5QzJQwEFpDxr8u4PQ6TMh-v358" ;
const platform = new H.service.Platform({
    apikey: apiKey,
});

const omvService = platform.getOMVService({
    path: 'v2/vectortiles/core/mc',
});
const baseUrl = 'https://js.api.here.com/v3/3.1/styles/omv/oslo/japan/';

// 日本専用の地図スタイルを導入
const style = new H.map.Style(`${baseUrl}normal.day.yaml`, baseUrl);

// 背景地図として日本の地図データでレイヤを作成
const omvProvider = new H.service.omv.Provider(omvService, style);
const omvlayer = new H.map.layer.TileLayer(omvProvider, {
    max: 22,
});

// 地図表示を実装
const map = new H.Map(document.getElementById('map'), omvlayer, {
    zoom: 15,
    center: { lat: 36.19525665057137, lng: 139.239369703212},
});
   //ポリゴン
	
	var rect = new H.map.Rect(new H.geo.Rect(36.19839331698311,139.23737463929896,36.1974872445441,139.2387250242977));
	var rect1 = new H.map.Rect(new H.geo.Rect(36.19643422822804,139.23566010552966,36.19538119778601,139.23681324328143));
	

	
	map.addObject(rect);
	map.addObject(rect1);
	

// 地図のズームイン・ズームアウトを実装
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// リアルタイム交通状況を表示
const defaultLayers = platform.createDefaultLayers();
map.addLayer(defaultLayers.vector.traffic.map);

// エラーが発生した場合の処理
function onError(error) {
    alert("Can't reach the remote server");
}
// APIの結果が返される際の関数
function addLocationsToMap(result) {
    const locations = result.items;

    // 地図から既存のマーカーを削除する
    if (map.getObjects().length > 0) {
        map.getObjects().forEach((i) => {
            if (i.getRemoteId().includes('discover')) {
                map.removeObject(i);
            }
        });
    }

    // APIの結果にマーカーを追加する
    for (let i = 0; i < locations.length; i += 1) {
        let location = locations[i];
        marker = new H.map.Marker(location.position);
        marker.setRemoteId('discover' + i.toString());
        map.addObject(marker);
    }
}

     
    
function getRouting() {
    //let origin;
    let destination;
    const onError = (error) => {
        console.log(error.message);
	
    };

    // 経路検索APIを呼び出し
    const router = platform.getRoutingService(null, 8);

    // APIのリスポンスを処理するためのコールバック関数
    const onResult = function (result) {
        // 経路が検索されていることを確保
        if (result.routes.length) {
            // 既存の経路を削除する
            

            result.routes[0].sections.forEach((section) => {
                // 経路をLinestring方式に変換する
                const linestring = H.geo.LineString.fromFlexiblePolyline(
                    section.polyline
                );

                // 経路をPolyline形式に変換
                const routeLine = new H.map.Polyline(linestring, {
                    style: {
                        strokeColor: 'blue',
                        lineWidth: 3,
                    },
                });

                // 出発地のマーカー
                const startMarker = new H.map.Marker(
                    section.departure.place.location
                );

                // 目的地のマーカー
                const endMarker = new H.map.Marker(
                    section.arrival.place.location
                );

                routeLine.setRemoteId('route');
                startMarker.setRemoteId('start');
                endMarker.setRemoteId('dest');

                // マーカーとPolylineを地図上に追加する
                map.addObjects([routeLine, startMarker, endMarker]);
            });
        }
    };

    const routingParameters = {
        transportMode: 'pedestrian',
	
        // 経路がリスポンスから返されるようにする
        return: 'polyline',
    };
    // 経路を計算するコールバック関数
    const calculateRoute = () => {
        // 出発地と到着地点の両方が入力されていることを確保
      
 //if (!origin || !destination) return;

        // 出発地と目的地を検索パラメーターに追加

	let routingParameters1 ={
	'routingMode': 'fast',
	'transportMode': 'pedestrian',
	'origin' : '36.19553505377256,139.23940775234948',
	'destination': '36.20069522057751,139.2360562130037',
        'avoid[areas]':['polygon:36.19839331698311,139.23737463929896;36.1974872445441,139.23737463929896;36.1974872445441,139.2387250242977;36.19839331698311,139.2387250242977',
			'polygon:36.19643422822804,139.23566010552966;36.19538119778601,139.23566010552966;36.19538119778601,139.23681324328143;36.19643422822804,139.23681324328143'

].join('|'),
        'return': 'polyline,turnByTurnActions,actions,instructions,travelSummary'

	};
router.calculateRoute(routingParameters1, onResult, onError);

 };  

//位置情報
  function success(pos){
	origin = pos.coords.latitude + ',' + pos.coords.longitude;
  	calculateRoute();}

  function fail(pos){
	alert('位置情報の取得に失敗。エラーコード：検索できません');
  }

  navigator.geolocation.getCurrentPosition(success,fail); 






}
//ここから二箇所目の避難場所
function getRouting1() {
    //let origin;
    let destination;
    const onError = (error) => {
        console.log(error.message);
	
    };

    // 経路検索APIを呼び出し
    const router = platform.getRoutingService(null, 8);

    // APIのリスポンスを処理するためのコールバック関数
    const onResult = function (result) {
        // 経路が検索されていることを確保
        if (result.routes.length) {
            // 既存の経路を削除する
            

            result.routes[0].sections.forEach((section) => {
                // 経路をLinestring方式に変換する
                const linestring = H.geo.LineString.fromFlexiblePolyline(
                    section.polyline
                );

                // 経路をPolyline形式に変換
                const routeLine = new H.map.Polyline(linestring, {
                    style: {
                        strokeColor: 'red',
                        lineWidth: 3,
                    },
                });

                // 出発地のマーカー
                const startMarker = new H.map.Marker(
                    section.departure.place.location
                );

                // 目的地のマーカー
                const endMarker = new H.map.Marker(
                    section.arrival.place.location
                );

                routeLine.setRemoteId('route');
                startMarker.setRemoteId('start');
                endMarker.setRemoteId('dest');

                // マーカーとPolylineを地図上に追加する
                map.addObjects([routeLine, startMarker, endMarker]);
            });
        }
    };

    const routingParameters = {
        transportMode: 'pedestrian',
	
        // 経路がリスポンスから返されるようにする
        return: 'polyline',
    };
    // 経路を計算するコールバック関数
    const calculateRoute = () => {
        // 出発地と到着地点の両方が入力されていることを確保
      
 //if (!origin || !destination) return;

        // 出発地と目的地を検索パラメーターに追加

	let routingParameters1 ={
	'routingMode': 'fast',
	'transportMode': 'pedestrian',
	'origin' : '36.19553505377256,139.23940775234948',
	'destination': '36.19501389554841,139.2351113834676',
        'avoid[areas]':['polygon:36.19839331698311,139.23737463929896;36.1974872445441,139.23737463929896;36.1974872445441,139.2387250242977;36.19839331698311,139.2387250242977',
			'polygon:36.19643422822804,139.23566010552966;36.19538119778601,139.23566010552966;36.19538119778601,139.23681324328143;36.19643422822804,139.23681324328143'

].join('|'),
        'return': 'polyline,turnByTurnActions,actions,instructions,travelSummary'

	};
router.calculateRoute(routingParameters1, onResult, onError);

 };  

//位置情報
  function success(pos){
	origin = pos.coords.latitude + ',' + pos.coords.longitude;
  	calculateRoute();}

  function fail(pos){
	alert('位置情報の取得に失敗。エラーコード：検索できません');
  }

  navigator.geolocation.getCurrentPosition(success,fail); 






}
