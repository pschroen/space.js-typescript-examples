import { router } from '@alienkitty/space.js';

router.add('/', onPage, { title: 'Home' });

router.init({
    path: '/examples',
    scrollRestoration: 'auto'
});

function onPage({ title }: { title: string }) {
    document.title = `${title} — Alien Kitty`;
}
