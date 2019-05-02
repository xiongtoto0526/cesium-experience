var viewer = new Cesium.Viewer('cesiumDemo',{
        baseLayerPicker: false,
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        })
    });

    var scene = viewer.scene;
    var canvas = viewer.canvas; // 获取画布
    canvas.setAttribute('tabindex', '0'); // 获取焦点
    canvas.onclick = function() {
        canvas.focus();
    };
    var ellipsoid = viewer.scene.globe.ellipsoid; // 获取地球球体对象

    // 禁用默认的事件处理程序
    // 如果为真，则允许用户旋转相机。如果为假，相机将锁定到当前标题。此标志仅适用于2D和3D。
    scene.screenSpaceCameraController.enableRotate = false;
    // 如果为true，则允许用户平移地图。如果为假，相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式。
    scene.screenSpaceCameraController.enableTranslate = false;
    // 如果为真，允许用户放大和缩小。如果为假，相机将锁定到距离椭圆体的当前距离
    scene.screenSpaceCameraController.enableZoom = false;
    // 如果为真，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
    scene.screenSpaceCameraController.enableTilt = false;
    // 如果为true，则允许用户使用免费外观。如果错误，摄像机视图方向只能通过转换或旋转进行更改。此标志仅适用于3D和哥伦布视图模式。
    scene.screenSpaceCameraController.enableLook = false;

    // 鼠标开始位置
    var startMousePosition;
    // 鼠标位置
    var mousePosition;
    // 鼠标状态标志
    var flags = {
        looking : false,
        moveForward : false, // 向前
        moveBackward : false, // 向后
        moveUp : false,// 向上
        moveDown : false,// 向下
        moveLeft : false,// 向左
        moveRight : false// 向右
    };

    var handler = new Cesium.ScreenSpaceEventHandler(canvas);

    // 接收用户鼠标（手势）事件
    handler.setInputAction(function(movement) {
        // 处理鼠标按下事件
        // movement: 接收值为一个对象，含有鼠标单击的x，y坐标
        flags.looking = true;
        // 设置鼠标当前位置
        mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(function(movement) {
        // 处理鼠标移动事件
        // 更新鼠标位置
        mousePosition = movement.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function(position) {
        // 处理鼠标左键弹起事件
        flags.looking = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // 根据键盘按键返回标志
    function getFlagForKeyCode(keyCode) {
        switch (keyCode) {
            case 'W'.charCodeAt(0):
                return 'moveForward';
            case 'S'.charCodeAt(0):
                return 'moveBackward';
            case 'Q'.charCodeAt(0):
                return 'moveUp';
            case 'E'.charCodeAt(0):
                return 'moveDown';
            case 'D'.charCodeAt(0):
                return 'moveRight';
            case 'A'.charCodeAt(0):
                return 'moveLeft';
            default:
                return undefined;
        }
    }
    // 监听键盘按下事件
    document.addEventListener('keydown', function(e) {
        // 获取键盘返回的标志
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== 'undefined') {
            flags[flagName] = true;
        }
    }, false);

    // 监听键盘弹起时间
    document.addEventListener('keyup', function(e) {
        // 获取键盘返回的标志
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== 'undefined') {
            flags[flagName] = false;
        }
    }, false);

    // 对onTick事件进行监听
    // onTick事件：根据当前配置选项，从当前时间提前计时。应该每个帧都调用tick，而不管动画是否发生。
    // 简单的说就是每过一帧都会执行这个事件
    viewer.clock.onTick.addEventListener(function(clock) {
        // 获取实例的相机对象
        var camera = viewer.camera;

        if (flags.looking) {
            // 获取画布的宽度
            var width = canvas.clientWidth;
            // 获取画布的高度
            var height = canvas.clientHeight;

            // Coordinate (0.0, 0.0) will be where the mouse was clicked.
            var x = (mousePosition.x - startMousePosition.x) / width;
            var y = -(mousePosition.y - startMousePosition.y) / height;
            var lookFactor = 0.05;

            camera.lookRight(x * lookFactor);
            camera.lookUp(y * lookFactor);
        }

        // 获取相机高度
        // cartesianToCartographic(): 将笛卡尔坐标转化为地图坐标，方法返回Cartographic对象，包含经度、纬度、高度
        var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;

        var moveRate = cameraHeight / 100.0;

        // 如果按下键盘就移动
        if (flags.moveForward) {
            camera.moveForward(moveRate);
        }
        if (flags.moveBackward) {
            camera.moveBackward(moveRate);
        }
        if (flags.moveUp) {
            camera.moveUp(moveRate);
        }
        if (flags.moveDown) {
            camera.moveDown(moveRate);
        }
        if (flags.moveLeft) {
            camera.moveLeft(moveRate);
        }
        if (flags.moveRight) {
            camera.moveRight(moveRate);
        }
    });
--------------------- 
作者：库塔姆斯 
来源：CSDN 
原文：https://blog.csdn.net/HobHunter/article/details/74909641 
版权声明：本文为博主原创文章，转载请附上博文链接！