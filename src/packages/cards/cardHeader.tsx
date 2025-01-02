import { DetailedHTMLProps, HTMLAttributes } from 'react'

interface CardHeaderProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export default function Card(props: CardHeaderProps) {
    /** @todo Add prunedString() tagged template literal that
     * clears out falsy values and replaces them with empty strings. and ensures
     * spaces between args?
     */
    return (
        <div className={`${props.className}`} {...props}>
            {props.children}
        </div>
    )
}
