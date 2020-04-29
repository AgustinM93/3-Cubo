import { getCanvasElement, getWebGL2Context, createShader, createProgram, createVertexBuffer, bindAttributeToVertexBuffer, createIndexBuffer, magic } from "./utils/gl-utils.js"
import { vertexShaderSourceCode, fragmentShaderSourceCode } from "./utils/shaders.js"

// #️⃣ Configuración base de WebGL

// Encontramos el canvas y obtenemos su contexto de WebGL
const canvas = getCanvasElement('canvas')
const gl = getWebGL2Context(canvas)

// Seteamos el color que vamos a usar para 'limpiar' el canvas (i.e. el color de fondo)
gl.clearColor(0, 0, 0, 1)

// Habilitamos el test de profundidad
gl.enable(gl.DEPTH_TEST)

// #️⃣ Creamos los shaders, el programa que vamos a usar, y guardamos info de sus atributos

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode)

const program = createProgram(gl, vertexShader, fragmentShader)

const vertexPositionLocation = gl.getAttribLocation(program, 'vertexPosition')
const vertexColorLocation = gl.getAttribLocation(program, 'vertexColor')

// #️⃣ Definimos la info de la geometría que vamos a dibujar (un cubo)

const vertexPositions = [
  -0.14,-1.702,5.936,
  -0.14,-1.489,6.031,
  0,-2.115,6.089,
  0.14,-1.702,5.936,
  0,-1.794,6.45,
  -0.14,0.926,0.609,
  -0.14,0.713,0.514,
  0,0.482,3.66,
  0.14,-1.489,6.031,
  0,-2.025,6.347,
  -0.14,0.661,3.74,
  0,1.033,0.103,
  -0.14,1.858,4.274,
  0.14,1.858,4.274,
  0.14,0.713,0.514,
  0,0.55,0.105,
  0,2.115,4.387,
  0,0.802,0,
  0.14,0.661,3.74,
  0.14,0.926,0.609
]

const vertexColors = [
  1, 1, 0,    // 0 👈 indice de cada color
  1, 1, 1,    // 1
  0, 0, 1,    // 2
  0, 1, 1,    // 3
  1, 0, 0,    // 4
  1, 1, 0,    // 0 👈 indice de cada color
  1, 1, 1,    // 1
  0, 0, 1,    // 2
  0, 1, 1,    // 3
  1, 0, 0,    // 4
  1, 1, 0,    // 0 👈 indice de cada color
  1, 1, 1,    // 1
  0, 0, 1,    // 2
  0, 1, 1,    // 3
  1, 0, 0,    // 4
  1, 1, 0,    // 0 👈 indice de cada color
  1, 1, 1,    // 1
  0, 0, 1,    // 2
  0, 1, 1,    // 3
  1, 0, 0,    // 4

]

const indices = [
12 	,10 ,1,
2 ,	3 ,	9,
3, 	18, 	8,
12, 	5, 	10,
6 ,	10, 	5,
0, 	1, 	10,
14, 	15, 	17,
7, 	18, 	3,
15, 	6, 	17,
9, 	4, 	0,
9, 	0, 	2,
15, 	7, 	6,
9, 	3, 	4,
8, 	13, 	16,
7, 	3, 	2,
8, 	4, 	3,
10, 	6, 	7,
5, 	12, 	16,
11, 	19, 	14,
14, 	7, 	15,
0, 	10, 	7,
13, 	8, 	18,
19, 	13, 	18,
16, 	1, 	4,
4, 	8, 	16,
1, 	16, 	12,
18, 	7, 	14,
11, 	17, 	6,
11, 	5, 	16,
16, 	13, 	19,
0, 	7, 	2,
11, 	6, 	5,
1, 	0, 	4,
16, 	19, 	11,
17, 	11, 	14,
18, 	14, 	19
  
]

/* 📝 Cada cara esta formada por dos triángulos, donde sus indices siguen la convención de sentido
 * anti-horario 🔄
 */

// #️⃣ Guardamos la info de la geometría en VBOs e IBOs

const vertexPositionsBuffer = createVertexBuffer(gl, vertexPositions)
const vertexColorsBuffer = createVertexBuffer(gl, vertexColors)
const indexBuffer = createIndexBuffer(gl, indices)

// #️⃣ Asociamos los atributos del programa a los buffers creados, y establecemos el buffer de indices a usar

// Creamos un Vertex Array Object (VAO)
const vertexArray = gl.createVertexArray()

// A partir de aca, el VAO registra cada atributo habilitado y su conexión con un buffer, junto con los indices
gl.bindVertexArray(vertexArray)

// Habilitamos cada atributo y lo conectamos a su buffer
gl.enableVertexAttribArray(vertexPositionLocation)
bindAttributeToVertexBuffer(gl, vertexPositionLocation, 3, vertexPositionsBuffer)
gl.enableVertexAttribArray(vertexColorLocation)
bindAttributeToVertexBuffer(gl, vertexColorLocation, 3, vertexColorsBuffer)

// Conectamos el buffer de indices que vamos a usar
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

// Dejamos de tomar nota en el VAO
gl.bindVertexArray(null)

// #️⃣ Establecemos el programa a usar, sus conexiónes atributo-buffer e indices a usar (guardado en el VAO)

gl.useProgram(program)
gl.bindVertexArray(vertexArray)

// ✨ Magia (que mas adelante vamos a ver qué esta haciendo)
magic(gl, program, canvas)

// #️⃣ Dibujamos la escena

// Limpiamos el canvas
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

// Y dibujamos 🎨
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
