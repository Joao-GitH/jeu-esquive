# PhysicsEngineJS
This is a physics engine library fully made in JavaScript 

## Getting started
To use the libraray just download the project and import the classes you need through the `PhysicsEngine.js` file

## Usage/Examples

### Project tree example
```bash
your-project/
├── script.js
└── PhysicsEngineJS/
	├── Colliders
	│	├── circleCollider.js
	│	├── collider.js
	│	├── colliderType.js
	│	└── rectangleCollider.js
	├── event.js
	├── PhysicsEngine.js
	├── physicsWorld.js
	├── vector.js
	└── README.md
```

### Html example
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Physics engine</title>
	<script src="script.js" type="module"></script>
	<style>
		canvas{
			height: 500px;
			width: 500px;
			border: 3px solid black;
			image-rendering: pixelated;
		}
	</style>
</head>
<body>
	<canvas></canvas>
</body>
</html>
```

### Script example
```javascript
import { CircleCollider, Collider, ColliderType, PhysicsWorld, RectangleCollider, Vector } from "./PhysicsEngine/PhysicsEngine.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 500;

const keys = [];

const physicsWorld = new PhysicsWorld(ctx, 1);
const collider = new RectangleCollider(0, 100, 100, 100, ColliderType.dynamic);
const circle = new CircleCollider(30, 0, 30, ColliderType.dynamic);
const ground = new RectangleCollider(0, 400, 500, 100);

physicsWorld.addColliders(collider, ground, circle);

function update(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	handleKeys();
	physicsWorld.draw();
	physicsWorld.update();
	ctx.imageSmoothingEnabled = false;
	requestAnimationFrame(update);
}
update();

addEventListener("keydown", e => {
	const key = e.key.toString().toUpperCase();
	if(!keys.includes(key))
		keys.push(key);
})

function handleKeys(){
	if(keys.includes("W"))
		collider.velocity.y = -10 * 2;
	if(keys.includes("A"))
		collider.velocity.x = -10;
	if(keys.includes("D"))
		collider.velocity.x = 10;
}

addEventListener("keyup", e => {
	const key = e.key.toString().toUpperCase();
	keys.splice(keys.indexOf(key), 1);
	switch (key) {
		case "A":
			if (collider.velocity.x < 0)
				collider.velocity.x = 0;
			break;
		case "D":
			if (collider.velocity.x > 0)
				collider.velocity.x = 0;
			break;
	}
})
```