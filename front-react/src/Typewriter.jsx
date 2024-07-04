import React, { useState, useEffect } from "react";
import styles from './MyComponent.module.css';

const Typewriter = ({text, delay = 70}) => {
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
	return (
	<>
		<span>
			{currentText}
			<span className={styles.cursor}>|</span>
		</span>
	</>
	);
};

export default Typewriter;