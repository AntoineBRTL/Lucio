import { RenderingEnvironment } from "./RenderingEnvironment.js";
import { RenderingQuad } from "./RenderingQuad.js";
export class Renderer {
    constructor(raytracerVert, raytracerFrag) {
        this.renderingEnvironment = new RenderingEnvironment();
        this.renderingQuad = new RenderingQuad(this.renderingEnvironment.getGL(), raytracerVert, raytracerFrag);
    }
    /** Clears the frame */
    clear(gl) {
        /** Clear color buffer */
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    render() {
        /** Gets OpenGL context */
        let gl = this.renderingEnvironment.getGL();
        /** Clear the old frame */
        this.clear(gl);
        /** Render the fullscreen Quad */
        this.renderingQuad.render(gl);
    }
}
