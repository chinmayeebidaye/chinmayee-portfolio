import { useEffect, useRef } from "react";

/**
 * 3D point-cloud robot arm with live object-detection boxes.
 * Ported from the original portfolio hero animation (three.js).
 */
export function RobotArm({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: () => void = () => {};
    (async () => {
      const THREE = await import("three");
      if (disposed || !canvasRef.current || !wrapRef.current) return;
      const cv = canvasRef.current;
      const hero = wrapRef.current;
      const b1 = box1Ref.current!;
      const b2 = box2Ref.current!;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

      let R: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
      } catch {
        return;
      }
      R.setPixelRatio(Math.min(devicePixelRatio, 2));
      const S = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 60);

      // Resolve theme colors (oklch var -> rgb) for three.js
      const themeColor = (name: string) => {
        const probe = document.createElement("span");
        probe.style.color = `var(${name})`;
        probe.style.display = "none";
        document.body.appendChild(probe);
        const rgb = getComputedStyle(probe).color;
        probe.remove();
        return new THREE.Color(rgb);
      };
      const cPrimary = themeColor("--primary");
      const cAccent = themeColor("--accent");
      const cMute = themeColor("--muted-foreground");

      const lineM = new THREE.LineBasicMaterial({ color: cAccent });
      const pointM = new THREE.PointsMaterial({ size: 0.035, color: cPrimary });

      const mk = (w: number, h: number, d: number) => {
        const g = new THREE.Group();
        const bg = new THREE.BoxGeometry(w, h, d, Math.ceil(w * 8), Math.ceil(h * 8), Math.ceil(d * 8));
        bg.translate(0, h / 2, 0);
        g.add(new THREE.LineSegments(new THREE.EdgesGeometry(bg), lineM), new THREE.Points(bg, pointM));
        return g;
      };

      const base = new THREE.Group();
      const l1 = mk(0.7, 0.5, 0.7);
      const sh = new THREE.Group();
      const l2 = mk(0.34, 1.7, 0.34);
      const el = new THREE.Group();
      const l3 = mk(0.28, 1.4, 0.28);
      const wr = new THREE.Group();
      const gr = mk(0.5, 0.3, 0.22);
      el.position.y = 1.7;
      wr.position.y = 1.4;
      sh.position.y = 0.5;
      base.add(l1, sh);
      sh.add(l2, el);
      el.add(l3, wr);
      wr.add(gr);
      S.add(base);
      base.position.set(1.8, 0, 0);

      // depth-map floor
      const N = 70;
      const fp = new Float32Array(N * N * 3);
      const fc = new Float32Array(N * N * 3);
      const floorM = new THREE.PointsMaterial({ size: 0.04, vertexColors: true });
      const fg = new THREE.BufferGeometry();
      fg.setAttribute("position", new THREE.BufferAttribute(fp, 3));
      fg.setAttribute("color", new THREE.BufferAttribute(fc, 3));
      S.add(new THREE.Points(fg, floorM));
      for (let x = 0; x < N; x++) {
        for (let z = 0; z < N; z++) {
          const k = (x * N + z) * 3;
          const px = (x - N / 2) * 0.24;
          const pz = (z - N / 2) * 0.24;
          const h = Math.sin(px * 0.7) * Math.cos(pz * 0.6) * 0.35;
          fp[k] = px;
          fp[k + 1] = h - 0.02;
          fp[k + 2] = pz;
          const m = (h + 0.35) / 0.7;
          const c = cMute.clone().lerp(cAccent, m);
          fc[k] = c.r;
          fc[k + 1] = c.g;
          fc[k + 2] = c.b;
        }
      }

      let px = 0;
      const onMove = (e: PointerEvent) => {
        px = e.clientX / innerWidth - 0.5;
      };
      addEventListener("pointermove", onMove);

      const size = () => {
        const w = hero.clientWidth;
        const h = hero.clientHeight;
        R.setSize(w, h, false);
        cam.aspect = w / h;
        const wide = w > 760;
        cam.position.set(wide ? 7 : 6.5, wide ? 4.6 : 5, wide ? 9 : 11);
        cam.lookAt(wide ? 1.6 : 0, wide ? 1.8 : 2.2, 0);
        cam.updateProjectionMatrix();
      };

      const rect = (obj: InstanceType<typeof THREE.Object3D>, el: HTMLDivElement, pad: number) => {
        const b = new THREE.Box3().setFromObject(obj);
        const v = new THREE.Vector3();
        const W = hero.clientWidth;
        const H = hero.clientHeight;
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        for (let i = 0; i < 8; i++) {
          v.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(cam);
          const X = ((v.x + 1) / 2) * W;
          const Y = ((1 - v.y) / 2) * H;
          x0 = Math.min(x0, X);
          y0 = Math.min(y0, Y);
          x1 = Math.max(x1, X);
          y1 = Math.max(y1, Y);
        }
        el.style.left = x0 - pad + "px";
        el.style.top = y0 - pad + "px";
        el.style.width = x1 - x0 + pad * 2 + "px";
        el.style.height = y1 - y0 + pad * 2 + "px";
      };

      const t0 = performance.now();
      const draw = () => {
        const t = reduce ? 1.2 : (performance.now() - t0) / 1000;
        base.rotation.y = Math.sin(t * 0.4) * 0.7;
        sh.rotation.z = -0.35 + Math.sin(t * 0.6) * 0.35;
        el.rotation.z = 0.9 + Math.sin(t * 0.9 + 1) * 0.5;
        wr.rotation.z = -0.5 + Math.sin(t * 1.3) * 0.4;
        S.rotation.y = -0.35 + px * 0.5;
        base.updateMatrixWorld(true);
        cam.updateMatrixWorld();
        R.render(S, cam);
        rect(base, b1, 10);
        rect(gr, b2, 6);
        if (!reduce && ((t * 2) | 0) % 6 === 0) {
          b1.firstElementChild!.textContent = "manipulator " + (0.94 + Math.sin(t * 3) * 0.02).toFixed(2);
          b2.firstElementChild!.textContent = "gripper " + (0.91 + Math.cos(t * 2.3) * 0.03).toFixed(2);
        }
      };

      size();
      const onResize = () => {
        size();
        draw();
      };
      addEventListener("resize", onResize);

      let raf = 0;
      let io: IntersectionObserver | null = null;
      if (reduce) {
        draw();
      } else {
        let vis = true;
        io = new IntersectionObserver((e) => {
          vis = e[0]?.isIntersecting ?? false;
        }, { threshold: 0 });
        io.observe(hero);
        const loop = () => {
          if (vis) draw();
          raf = requestAnimationFrame(loop);
        };
        loop();
      }
      cleanup = () => {
        io?.disconnect();
        cancelAnimationFrame(raf);
        removeEventListener("pointermove", onMove);
        removeEventListener("resize", onResize);
        R.dispose();
        fg.dispose();
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div ref={box1Ref} className="detect-box detect-lock border-accent">
        <span className="bg-accent text-accent-foreground">manipulator 0.96</span>
      </div>
      <div ref={box2Ref} className="detect-box detect-lock border-primary" style={{ animationDelay: ".5s" }}>
        <span className="bg-primary text-primary-foreground">gripper 0.93</span>
      </div>
    </div>
  );
}
