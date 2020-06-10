import React from 'react';
import Link from 'next/link'

const Header = () => (

    <header className="header">
        <ul className="nav nav--animated">
            <li className="nav__item">
                <Link href="/" prefetch={false}>
                    <a className="nav__link">World</a>
                </Link>
            </li>
            <li className="nav__item">
                <Link href="/continent/Europe" prefetch={false}>
                    <a className="nav__link">Europe</a>
                </Link>
            </li>
            <li className="nav__item">
                <Link href="/continent/Asia" prefetch={false}>
                    <a className="nav__link">Asia</a>
                </Link>
            </li>
            <li className="nav__item">
                <Link href="/continent/North_America" prefetch={false}>
                    <a className="nav__link">North America</a>
                </Link>
            </li>
            <li className="nav__item">
                <Link href="/continent/South_America" prefetch={false}>
                    <a className="nav__link">South America</a>
                </Link>
            </li>
            <li className="nav__item nav__item--africa">
                <Link href="/continent/Africa" prefetch={false}>
                    <a className="nav__link">Africa</a>
                </Link>
            </li>
            <li className="nav__item">
                <Link href="/continent/Oceania" prefetch={false}>
                    <a className="nav__link">Oceania</a>
                </Link>
            </li>
        </ul>
    </header>
);

export default Header;



