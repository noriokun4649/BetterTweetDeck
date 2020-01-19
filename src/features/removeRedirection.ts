import {TweetDeckObject} from '../types/tweetdeckTypes';

/** Removes the t.co redirection on links. */
export const maybeRemoveRedirection = (TD: TweetDeckObject) => {
  const dummyEl = document.createElement('span');

  const originalMethod = TD.util.createUrlAnchor;

  if (!originalMethod) {
    return;
  }

  TD.util.createUrlAnchor = (e: any) => {
    // Run the url through the original function first.
    let result = originalMethod(e);

    // Create an in-memory <a> element to store the result of the original function.
    dummyEl.innerHTML = result;
    // Find the anchor inside that result.
    const anchor = dummyEl.querySelector('a');

    if (anchor) {
      anchor.href = anchor.dataset.fullUrl as string;
      result = anchor.outerHTML;
    }

    return result;
  };
};