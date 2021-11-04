declare module "@parcellab/react-use-umami" {
  export interface UseUmamiHook {
    trackEvt(event_value: string, event_type: string);
  }

  export function registerUmamiScript(
    url: string,
    websiteId: string,
    dataDomain: string
  ): void;

  export default function useUmami(
    url: string,
    referrer?: string,
    website_id?: string,
    skipPageView?: boolean
  ): UseUmamiHook;
}
