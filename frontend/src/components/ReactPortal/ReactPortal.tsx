import {useLayoutEffect, useState} from 'react';
import {createPortal} from 'react-dom';

function createWrapperAndAppendToBody(wrapperId: string) {
    const wrapperElement = document.createElement('div');
    wrapperElement.setAttribute("id", wrapperId);
    document.body.appendChild(wrapperElement);
    return wrapperElement;
}


export type ReactPortalProps = {
    children: React.ReactNode,
    wrapperId?: string
}

export function ReactPortal({children, wrapperId = "react-portal-wrapper"}: ReactPortalProps) {
    const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

    useLayoutEffect(() => {
        let element = document.getElementById(wrapperId);
        let systemCreated = false;
        // if element is not found with wrapperId or wrapperId is not provided,
        // create and append to body
        if (!element) {
            systemCreated = true;
            element = createWrapperAndAppendToBody(wrapperId);
        }

        setWrapperElement(element);

        return () => {
            // delete the programatically created element
            if (systemCreated && element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }, [wrapperId]);

    // wrapperElement state will be null on very first render.
    if (wrapperElement === null) return null;

    return createPortal(children, wrapperElement);
}