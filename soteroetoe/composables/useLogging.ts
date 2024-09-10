export const useLogging = () => {
  const mainStore = useMainStore();

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onRequestError = (request: any) => {
    mainStore.messages.push(fetchTransformer(request));
  };
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onResponse = (request: any) => {
    mainStore.messages.push(fetchTransformer(request));
  };
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onResponseError = (request: any) => {
    mainStore.messages.push(fetchTransformer(request));
  };

  return { onRequestError, onResponse, onResponseError };
};
