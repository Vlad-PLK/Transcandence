import React, { useState, useEffect } from "react";

const Typewriter = ({text, delay = 100}) => {
	const [currentText, setCurrent] = useState('')
	const [currentIndex, setIndex] = useState(0);
	useEffect(() => {
		const typingInterval = setInterval(() => {
		  if (currentIndex < text.length) {
			setCurrent(text.substring(0, currentIndex + 1));
			setIndex(currentIndex + 1);
		  } else {
			clearInterval(typingInterval);
		  }
		}, delay);
	  
		return () => clearInterval(typingInterval); // Cleanup function
	  }, [text, currentIndex, delay]);
};

export default Typewriter;