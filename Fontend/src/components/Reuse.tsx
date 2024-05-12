import { useEffect, useState } from "react";

//#region chang number ","
export const formatNumberWithCommas = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
//#endregion

//#region Check Size Web
export const windowSizes = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [windowSize, setWindowSize] = useState(window.innerWidth);
  
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const handleResize = () => {
        setWindowSize(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [windowSize]);
    
    return windowSize;
};
//#endregion

//#region Input Image single and muti
export const dropzoneStyles : object = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export const previewStyles : object = {
  maxWidth: '100px',
  maxHeight: '100px',
  marginTop: '10px',
};

export const dropzonesStyles : object = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
};

export const previewsStyles : object = {
  maxWidth: '50px',
  maxHeight: '50px',
  objectFit: 'cover',
  marginLeft: '5px',
};
//#endregion
