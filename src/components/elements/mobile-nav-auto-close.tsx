'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

function closeMobileMenu() {
  const dialog = document.getElementById('mobile-menu')
  if (dialog instanceof HTMLDialogElement && dialog.open) {
    dialog.close()
  }
}

export function MobileNavAutoClose() {
  const pathname = usePathname()

  useEffect(() => {
    closeMobileMenu()
  }, [pathname])

  useEffect(() => {
    const dialog = document.getElementById('mobile-menu')
    if (!(dialog instanceof HTMLDialogElement)) {
      return
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      if (target.closest('a[href]')) {
        dialog.close()
      }
    }

    dialog.addEventListener('click', handleClick)
    return () => {
      dialog.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}
