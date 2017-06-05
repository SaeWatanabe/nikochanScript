cc.Class({
    extends: cc.Component,

    properties: {
        nikochan: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad: function () {

        // 初期化
        this.shapeArray = [];

        // プレハブからスプライトを生成する関数を１秒ごとに呼び出す
        this.schedule(this.generateApple, 1);

        // 空間の作成
        this.world = new cp.Space();

        // 重力の設定
        this.world.gravity = cp.v(0, -100);

        // 床の設定
        // XYともに長さを無限に設定
        var body = new cp.Body(Infinity, Infinity);
        // Y方向-200の位置にセット
        body.setPos(cp.v(0, -200));

        // 床の物理特性
        var shape = new cp.BoxShape(body, 1000, 20);
        shape.setFriction(1);
        shape.setElasticity(0);
        this.world.addShape(shape);
    },

    update: function (dt) {
        // 物理シミュレーションを毎フレームごとにする
        this.world.step(dt);

        // スプライトと物体の同期
        for (var i = this.shapeArray.length - 1; i >= 0; i--) {
            // 画像の位置と角度を変更する
            this.shapeArray[i].image.x = this.shapeArray[i].body.p.x;
            this.shapeArray[i].image.y = this.shapeArray[i].body.p.y;
            var angle = Math.atan2(-this.shapeArray[i].body.rot.y, this.shapeArray[i].body.rot.x);
            this.shapeArray[i].image.rotation = angle * 57.2957795;
        }
    },

    generateApple: function (dt) {

        // 0から1000までをランダムに表示
        var x = cc.random0To1() * 1000 - 500;
        var y = 200;

        //物体の種類設定
        var body = new cp.Body(1, cp.momentForBox(1, 70, 70));
        body.setPos(cp.v(x, y));

        //画像の用意
        var apple = cc.instantiate(this.apple);
        apple.setPosition(cc.p(x, y));
        this.node.addChild(apple);

        //物理空間への配置
        this.world.addBody(body);

        //物理特性
        var shape = new cp.CircleShape(body, 35, cp.vzero);
        shape.setFriction(1);
        shape.setElasticity(0);
        shape.image = apple;
        this.world.addShape(shape);
        this.shapeArray.push(shape);
    }
});
