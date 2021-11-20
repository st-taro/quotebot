let parse = (
  msg: string
): { url: string; hero: string; response: string; code: number } => {
  /**
   * Accepts message content and returns an object for a corresponding dota voice response.
   * Or a blank string if there is no match
   *
   * return object:
   * {
   *  url: string,
   *  hero: string,
   *  response: string
   * }
   */

  const m = msg.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

  console.log(m);

  // default returns
  return { url: '', hero: '', response: '', code: 0 };
};
