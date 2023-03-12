export class ShaderActor
{   
    private vertexShader: WebGLShader;
    private fragmentShader: WebGLShader;
    private program: WebGLProgram;

    public constructor(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string)
    {
        this.vertexShader = this.compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        this.fragmentShader = this.compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        this.program = this.createProgram(gl, this.vertexShader, this.fragmentShader);
    }

    /** Compiles a shader from its source and returns it */
    private compileShader(gl: WebGL2RenderingContext, source: string, type: number): WebGLShader
    {
        // Create shader object.
        let shader: WebGLShader | null;
        shader = gl.createShader(type);
        if(!shader) throw new Error("Failed to create shader");

        // Add its source & compile it.
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        // Log possible errors.
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw new Error(`Error in ${type} ` + gl.getShaderInfoLog(shader)?.toString());

        return shader;
    }

    /** Creates a program from compiled shaders and returns it */
    private createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram
    {
        // Create a program object.
        let program: WebGLProgram | null;
        program = gl.createProgram();
        if(!program) throw new Error("Failed to create program");

        // Attach the vertex & fragment shader, & link it to OpenGL.
        gl.attachShader(program, fragmentShader);
        gl.attachShader(program, vertexShader);
        gl.linkProgram(program);

        return program;
    }

    protected getVertexShader(): WebGLShader
    {
        return this.vertexShader;
    }

    protected getFragmentShader(): WebGLShader
    {
        return this.fragmentShader;
    }

    protected getProgram(): WebGLProgram
    {
        return this.program;
    }
}