let vertexShaderText =
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'   fragColor = vertColor;',
'   gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}',
].join('\n');

let fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'   gl_FragColor = vec4(fragColor, 1.0);',
'}',
].join('\n')

function initDemo() {
    let canvas = document.getElementById("webgl-canvas");
    let gl = canvas.getContext("webgl");

    if (!gl) {
        gl = canvas.getContext("experimental-webgl")
        console.log("WebGL not supported. Attempting experimental WebGL")
    }

    if (!gl) {
        alert("WebGL is not supported. Update your browser!")
    }

    gl.clearColor(0.1,0.1,0.1,1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling vertex shader: ', gl.getShaderInfoLog(vertexShader))
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling fragment shader: ', gl.getShaderInfoLog(fragmentShader))
        return;
    }

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program: ', gl.getProgramInfoLog(program))
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating program: ', gl.getProgramInfoLog(program))
        return;
    }

    //
    // Create buffer
    //
    let triangleVertices =
        [ // X, Y, R, G, B
            0.0, 0.5, 1.0, 0.0, 0.0,
            -0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, -0.5, 0.0, 0.0, 1.0
        ];

    let triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW)

    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    //  Main render loop
    //

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

}

window.onload = function() {
    initDemo();
}
