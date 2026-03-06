import { Children, Fragment, isValidElement, type ReactNode } from 'react'

export function flattenChildren(children: ReactNode): ReactNode[] {
  const items: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Fragment) {
      const fragmentChildren = (child.props as { children?: ReactNode }).children
      items.push(...flattenChildren(fragmentChildren))
      return
    }

    items.push(child)
  })

  return items
}
