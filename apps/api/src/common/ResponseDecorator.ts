const ResponseDecorator = <T>(res: T, success = true) => {
  return {
    success,
    data: res,
  };
};
export default ResponseDecorator;
