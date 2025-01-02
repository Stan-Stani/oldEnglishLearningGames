import { DetailedHTMLProps, HTMLAttributes } from 'react'

interface CardProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export default function Card(props: CardProps) {
    /** @todo Add prunedString() tagged template literal that
     * clears out falsy values and replaces them with empty strings. and ensures
     * spaces between args?
     */
    return (
        <div className={`${props.className} flex-1`} {...props}>
            {props.children}
        </div>
    )
}
