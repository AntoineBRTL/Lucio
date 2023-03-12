export class ShaderActor {
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        this.vertexShader = this.compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        this.fragmentShader = this.compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        this.program = this.createProgram(gl, this.vertexShader, this.fragmentShader);
    }
    /** Compiles a shader from its source and returns it */
    compileShader(gl, source, type) {
        var _a;
        // Create shader object.
        let shader;
        shader = gl.createShader(type);
        if (!shader)
            throw new Error("Failed to create shader");
        // Add its source & compile it.
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        // Log possible errors.
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw new Error(`Error in ${type} ` + ((_a = gl.getShaderInfoLog(shader)) === null || _a === void 0 ? void 0 : _a.toString()));
        return shader;
    }
    /** Creates a program from compiled shaders and returns it */
    createProgram(gl, vertexShader, fragmentShader) {
        // Create a program object.
        let program;
        program = gl.createProgram();
        if (!program)
            throw new Error("Failed to create program");
        // Attach the vertex & fragment shader, & link it to OpenGL.
        gl.attachShader(program, fragmentShader);
        gl.attachShader(program, vertexShader);
        gl.linkProgram(program);
        return program;
    }
    getVertexShader() {
        return this.vertexShader;
    }
    getFragmentShader() {
        return this.fragmentShader;
    }
    getProgram() {
        return this.program;
    }
}
