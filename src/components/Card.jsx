import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import './Card.css';
import spritesheet from '../assets/CuteCards - asset pack/CuteCards.png';
import { WaitingStateContext } from '../context/WaitingStateProvider';
export default function Card({
  spriteSheet,
  spriteWidth,
  spriteHeight,
  totalFrames,
  frameRate,
  frameIndex,
  onClick,
}) {
  const { waitingState } = useContext(WaitingStateContext);
  const canvasRef = useRef(null);
  const animationId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const sprite = new Image();
    sprite.src = spritesheet;
    const frameDuration = 1000 / frameRate;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spriteX = waitingState
        ? (14 % totalFrames) * spriteWidth
        : (frameIndex + (4 % totalFrames)) * spriteWidth;
      const spriteY = (1 % 4) * spriteHeight;
      ctx.drawImage(
        sprite,
        spriteX,
        spriteY,
        spriteWidth,
        spriteHeight,
        0,
        0,
        spriteWidth,
        spriteHeight
      );
    };
    animationId.current = setTimeout(() => {
      requestAnimationFrame(animate);
    }, frameDuration);
    sprite.onload = () => {
      animate();
    };
    return () => {
      clearTimeout(animationId.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [
    spriteSheet,
    spriteWidth,
    spriteHeight,
    totalFrames,
    frameRate,
    frameIndex,
    waitingState,
  ]);

  return (
    <>
      <motion.canvas
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        ref={canvasRef}
        style={{
          pointerEvents: !waitingState ? 'auto' : 'none',
        }}
        onClick={() => onClick(frameIndex)}
        width={spriteWidth}
        height={spriteHeight}
        className="Card"
      ></motion.canvas>
    </>
  );
}
