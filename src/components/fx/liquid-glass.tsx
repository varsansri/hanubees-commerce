"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { glassFragmentShader } from "./vendor/glass-shader";

/**
 * Liquid glass over a live source canvas.
 *
 * Uses the WebGL refraction shader from dashersw/liquid-glass-js (MIT), rewired
 * so the backdrop texture is uploaded from a source canvas each frame rather
 * than from a one-shot html2canvas snapshot of the document. That is what makes
 * it refract the animated gradient underneath instead of a frozen still, and it
 * removes the html2canvas dependency.
 *
 * Glass earns its place here because there is something specific to refract —
 * a moving gradient directly behind it. It is not applied anywhere the effect
 * would just be decoration over a flat surface.
 */

const VERTEX = /* glsl */ `
  attribute vec2 a_position;
  attribute vec2 a_texcoord;
  varying vec2 v_texcoord;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texcoord = a_texcoord;
  }
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidGlass({
  sourceRef,
  children,
  className = "",
  borderRadius = 20,
  tintOpacity = 0.18,
}: {
  /** Element containing the canvas to refract. */
  sourceRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  borderRadius?: number;
  tintOpacity?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const sourceHost = sourceRef.current;
    if (!host || !canvas || !sourceHost) return;

    const source = sourceHost.querySelector("canvas");
    if (!source) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, glassFragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // Full-screen quad
    const quad = (data: number[]) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      return buf;
    };
    const posBuf = quad([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const texBuf = quad([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);

    const posLoc = gl.getAttribLocation(program, "a_position");
    const texLoc = gl.getAttribLocation(program, "a_texcoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      image: u("u_image"),
      resolution: u("u_resolution"),
      textureSize: u("u_textureSize"),
      scrollY: u("u_scrollY"),
      pageHeight: u("u_pageHeight"),
      viewportHeight: u("u_viewportHeight"),
      containerPosition: u("u_containerPosition"),
      borderRadius: u("u_borderRadius"),
      blurRadius: u("u_blurRadius"),
      edgeIntensity: u("u_edgeIntensity"),
      rimIntensity: u("u_rimIntensity"),
      baseIntensity: u("u_baseIntensity"),
      edgeDistance: u("u_edgeDistance"),
      rimDistance: u("u_rimDistance"),
      baseDistance: u("u_baseDistance"),
      cornerBoost: u("u_cornerBoost"),
      rippleEffect: u("u_rippleEffect"),
      tintOpacity: u("u_tintOpacity"),
      warp: u("u_warp"),
    };

    let raf = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      raf = requestAnimationFrame(draw);

      const rect = host.getBoundingClientRect();
      const srcRect = source.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2 || srcRect.width < 2) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.uniform1i(uniforms.image, 0);

      // The source is a sibling canvas, not the document, so sampling is in
      // source-local pixels and scroll plays no part.
      gl.uniform2f(uniforms.resolution, rect.width, rect.height);
      gl.uniform2f(uniforms.textureSize, srcRect.width, srcRect.height);
      gl.uniform1f(uniforms.scrollY, 0);
      gl.uniform1f(uniforms.pageHeight, srcRect.height);
      gl.uniform1f(uniforms.viewportHeight, srcRect.height);
      gl.uniform2f(
        uniforms.containerPosition,
        rect.left - srcRect.left + rect.width / 2,
        rect.top - srcRect.top + rect.height / 2,
      );

      gl.uniform1f(uniforms.borderRadius, borderRadius);
      gl.uniform1f(uniforms.blurRadius, 5);
      gl.uniform1f(uniforms.edgeIntensity, 0.01);
      gl.uniform1f(uniforms.rimIntensity, 0.05);
      gl.uniform1f(uniforms.baseIntensity, 0.01);
      gl.uniform1f(uniforms.edgeDistance, 0.15);
      gl.uniform1f(uniforms.rimDistance, 0.8);
      gl.uniform1f(uniforms.baseDistance, 0.1);
      gl.uniform1f(uniforms.cornerBoost, 0.02);
      gl.uniform1f(uniforms.rippleEffect, 0.1);
      gl.uniform1f(uniforms.tintOpacity, tintOpacity);
      gl.uniform1f(uniforms.warp, 1);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // Only run while the panel is on screen.
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) draw();
      else cancelAnimationFrame(raf);
    });
    io.observe(host);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      gl.deleteProgram(program);
      gl.deleteTexture(texture);
    };
  }, [sourceRef, borderRadius, tintOpacity]);

  return (
    <div ref={hostRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 size-full"
        style={{ borderRadius }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
