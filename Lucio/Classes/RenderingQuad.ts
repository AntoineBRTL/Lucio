import { ShaderActor } from "./ShaderActor.js";

export class RenderingQuad extends ShaderActor
{
    private verticePositions: Float32Array;
    private vertexBuffer: WebGLBuffer;

    public constructor(gl: WebGL2RenderingContext, raytracerVert: string, raytracerFrag: string)
    {
        super(gl, raytracerVert, raytracerFrag);

        gl.useProgram(this.getProgram());

        this.verticePositions = this.generateQuadVerticePositions();
        this.vertexBuffer = this.generateVertexBuffer(gl);

        this.postUniform(gl);
    }

    /** Creates a vertex buffer, updates it and returns it */
    private generateVertexBuffer(gl: WebGL2RenderingContext): WebGLBuffer
    {
        /** Create a buffer and make sure it's not null */
        let vertexBuffer: WebGLBuffer | null = gl.createBuffer();
        if(!vertexBuffer) throw new Error("Can't create buffer");

        /** Update buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verticePositions, gl.STATIC_DRAW);

        /** Send buffer to vertex shader */
        let location = gl.getAttribLocation(this.getProgram(), "vertexPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

        /** Return a reference to it */
        return vertexBuffer;
    }

    /** Generates a Float32Array containings X & Y coordinates of 4 vertices, and returns it */
    private generateQuadVerticePositions(): Float32Array
    {
        /** Generate positions */
        let verticePositions: Float32Array = new Float32Array(2*4);
        verticePositions[0] = -1.0; verticePositions[1] = 1.0;
        verticePositions[2] = -1.0; verticePositions[3] = -1.0;
        verticePositions[4] = 1.0;  verticePositions[5] = -1.0;
        verticePositions[6] = 1.0;  verticePositions[7] = 1.0;
        /**                   X                           Y */

        return verticePositions;
    }

    /** Posts uniforms */
    private postUniform(gl: WebGL2RenderingContext): void
    {
        /** Focal uniform */
        let focalLengthLocation = gl.getUniformLocation(this.getProgram(), "focalLength");
        gl.uniform1f(focalLengthLocation, 3.0);

        /** Far uniform */
        let farLocation = gl.getUniformLocation(this.getProgram(), "far");
        gl.uniform1f(farLocation, 1000.0);

        /** Near uniform */
        let nearLocation = gl.getUniformLocation(this.getProgram(), "near");
        gl.uniform1f(nearLocation, 0.001);

        /** Resolution uniforms */
        this.updateShaderResolution(gl);
        window.addEventListener("resize", this.updateShaderResolution.bind(this, gl));
    }

    /** Updates the width and height uniforms on the shader */
    private updateShaderResolution(gl: WebGL2RenderingContext)
    {
        let widthLocation = gl.getUniformLocation(this.getProgram(), "width");
        let heightLocation = gl.getUniformLocation(this.getProgram(), "height");
        gl.uniform1f(widthLocation, window.innerWidth);
        gl.uniform1f(heightLocation, window.innerHeight);
    }

    /** Renders a quad */
    public render(gl: WebGL2RenderingContext): void
    {
        /** Random seed uniform */
        let randomSeedLocation = gl.getUniformLocation(this.getProgram(), "randomSeed");
        gl.uniform1f(randomSeedLocation,  Math.random()*2 - 1);

        /** Render the quad */
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.verticePositions.length/2);
    }
}