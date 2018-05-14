import React from 'react';

const slot = ({slotClass, alt, id, src, ...rest}) => (
  <div className={slotClass}>
    <img alt={alt} id={id} src={src} {...rest}/>
  </div>
);

export default slot;
