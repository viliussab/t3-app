export default class HtmlTemplate {
  private html: string;
 
  public constructor(rawDocument: string) {
    this.html = rawDocument;
  }

  public replace(keyword: string, value: string) {
    this.html = this.html.replaceAll(`((${keyword}))`, value); 

    return this;
  }

  public getResult() {
    return this.html;
  }
}
