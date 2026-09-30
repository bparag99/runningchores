/**
 * Running Chores brand mark.
 *
 * Single source of truth for the logo across the admin portal so the image,
 * alt text and sizing stay consistent. The asset lives in `public/RC_LOGO.jpg`
 * and is referenced by absolute path, matching how the rest of the site
 * references it.
 */
export function BrandLogo({
    size = 'md',
    className = '',
}: {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}) {
    const sizes = {
        sm: 'h-9 w-9 rounded-lg',
        md: 'h-11 w-11 rounded-xl',
        lg: 'h-14 w-14 rounded-xl',
        // Square source image — keep it square so the wordmark is not squashed.
        xl: 'h-16 w-16 rounded-2xl',
    }

    return (
        <img
            src="/RC_LOGO.jpg"
            alt="Running Chores logo"
            className={`${sizes[size]} shrink-0 object-cover ${className}`}
        />
    )
}
