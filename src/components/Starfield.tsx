import React, { useState, useRef, useEffect } from "react";
import { registerElement } from "react-nativescript";
registerElement("Canvas", () => require("@nativescript/canvas").Canvas);

export const Starfield = () => {
  const [speed, setSpeed] = useState(20);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const initializeStarfield = (canvas) => {
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight;
    const stars: Star[] = [];
    const numberOfStars = 1000;

    class Star {
      constructor() {
        this.x = random(-width / 2, width / 2);
        this.y = random(-height / 2, height / 2);
        this.z = random(0, 1000);
        this.pz = this.z;
      }

      update() {
        this.z -= speedRef.current;
        if (this.z < 1) {
          this.z = width;
          this.x = random(-width / 2, width / 2);
          this.y = random(-height / 2, height / 2);
          this.pz = this.z;
        }
      }

      show(ctx) {
        ctx.fillStyle = "white";

        let sx = map(this.x / this.z, 0, 1, width / 2, width);
        let sy = map(this.y / this.z, 0, 1, height / 2, height);

        let r = map(this.z, 0, width, 16, 0);
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function map(value, low1, high1, low2, high2) {
      return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
    }

    for (let i = 0; i < numberOfStars; i++) {
      stars.push(new Star());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.update();
        star.show(ctx);
      });
      requestAnimationFrame(animate);
    }

    animate();
  };

  return (
    <gridLayout rows="* auto">
      <canvas
        rowSpan="2"
        style={{
          backgroundColor: "black",
        }}
        onReady={(args) => {
          initializeStarfield(args.object);
        }}
      />
      <slider
        row="1"
        value={speed}
        minValue="1"
        maxValue="20"
        onValueChange={(event) => setSpeed(event.value)}
      />
    </gridLayout>
  );
};
