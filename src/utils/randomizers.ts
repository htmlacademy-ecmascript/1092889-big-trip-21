const generateRandomNumber = (min: number, max: number) => Math.floor((Math.random() * (max - min + 1) + min));

const generateRandomBoolean = () => Boolean(generateRandomNumber(0,1));

const getRandomArrayElement = <T>(array: T[]): T => array[generateRandomNumber(0, array.length - 1)];

export {
	generateRandomBoolean,
	generateRandomNumber,
	getRandomArrayElement
};
