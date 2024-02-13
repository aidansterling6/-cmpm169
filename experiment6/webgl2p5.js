p5.RendererGL.prototype._initContext = function() {
    this.drawingContext = this.canvas.getContext('webgl2', this._pInst._glAttributes);
    if (this.drawingContext == null)
      throw new Error("There was an error creating the WebGL 2 context");
    
    const dc = this.drawingContext;
    dc.enable(dc.DEPTH_TEST);
    dc.depthFunc(dc.LEQUAL);
    dc.viewport(0, 0, dc.drawingBufferWidth, dc.drawingBufferHeight);
    this._viewport = dc.getParameter(dc.VIEWPORT);
};