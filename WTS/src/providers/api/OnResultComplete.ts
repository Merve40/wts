/**
 * Callback interface for retrieving results from the server. 
 */
export interface OnResultComplete{

    /**
     * Method is called, once the server has returned the results.
     * @param source query source
     * @param json data in JSON-Format
     */
    onComplete(source, json);

}