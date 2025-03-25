import React from "react";
import { useSpring, animated } from "@react-spring/web";

const Fade = ({ children, direction = "up", duration = 500, delay = 0 }) => {
  const config = {
    up: { from: { opacity: 0, transform: "translateY(30px)" }, to: { opacity: 1, transform: "translateY(0)" } },
    down: { from: { opacity: 0, transform: "translateY(-30px)" }, to: { opacity: 1, transform: "translateY(0)" } },
    left: { from: { opacity: 0, transform: "translateX(-30px)" }, to: { opacity: 1, transform: "translateX(0)" } },
    right: { from: { opacity: 0, transform: "translateX(30px)" }, to: { opacity: 1, transform: "translateX(0)" } },
  };

  const animation = useSpring({
    from: config[direction].from,
    to: config[direction].to,
    config: { duration },
    delay,
  });

  return <animated.div style={animation}>{children}</animated.div>;
};

export default Fade;
