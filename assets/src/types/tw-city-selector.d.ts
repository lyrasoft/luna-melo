declare module 'tw-city-selector' {
  export interface TwCitySelectorOptions {
    el: string | null;
    elCounty: string | null;
    elDistrict: string | null;
    elZipcode?: string | null;

    only?: string | string[] | null;
    except?: string | string[] | null;
    disabled?: boolean;
    hasZipcode?: boolean;
    hiddenZipcode?: boolean;

    countyValue?: string | null;
    districtValue?: string | null;

    countyClassName?: string;
    countyFieldName?: string;
    districtClassName?: string;
    districtFieldName?: string;
    zipcodeClassName?: string;
    zipcodeFieldName?: string;

    lang?: string;

    standardWords?: boolean;
    bootstrapStyle?: boolean;
  }

  export default class TwCitySelector {
    constructor(options: TwCitySelectorOptions) {

    }
  }
}
