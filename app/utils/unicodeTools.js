// Based on platform and OS version you will either get this

// Property 'YMID' = '<03313538 37313436 3539>'
// Property 'YSEQ' = '<03313a31>'
// Property 'YCSP' = '<03313538 37313436 3539>'
// Property 'YTYP' = '<034d>'
// Property 'YDUR' = '<0330352e 36>'

// or that

// Property 'YMID' = '{length = 10, bytes = 0x03313538373134363539}'
// Property 'YSEQ' = '{length = 4, bytes = 0x03313a31}'
// Property 'YCSP' = '{length = 10, bytes = 0x03313538373134363539}'
// Property 'YTYP' = '{length = 2, bytes = 0x034d}'
// Property 'YDUR' = '{length = 5, bytes = 0x0330352e36}'

const isUnicode = raw => {
  const capture = raw.match(/03(.*)[}|>]$/);
  if (!capture) {
    return false;
  }

  return capture.length === 2;
};

const unicode2text = raw => {
  let ret = '';

  try {
    const capture = raw.replace(/\s/gi, '').match(/03(.*)[}|>]$/);
    const array = capture[1].match(/.{1,2}/g);

    array.forEach(data => {
      ret += String.fromCharCode(parseInt(data, 16));
    });
  } catch (error) {
    logger.log('unicode2text', error);
    return '';
  }

  return ret;
};

export { isUnicode, unicode2text };