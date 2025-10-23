export interface QuoteAttributes {
  reviewer?: string;
  year?: string;
  quote?: string;
}
export interface QuoteEditProps {
  attributes: QuoteAttributes;
  setAttributes: (attrs: Partial<QuoteAttributes>) => void;
}
