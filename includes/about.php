<section class="about-section">
    <h2>Om oss</h2>
    <h4>/ˈkɪnːfɔrma/</h4>
    <p>
        Kinforma förenar hållbarhet, design och teknologi. Vi skapar personlig 3D-printad inredning för som vill ha ett unikt hem med omtanke om miljön.
    </p>


    <div class="about-carousel">

        <ol class="about-list">
            <li>
                <img src="/assets/images/fishnet.svg" alt="Fishnet">
            </li>
            <li>
                <img src="/assets/images/fisher-man.svg" alt="Fisherman">
            </li>
            <li>
                <img src="/assets/images/printing.svg" alt="3D-printing">
            </li>
        </ol>

    </div>




    <div class="navigation-icons">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>



        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>


    </div>

    <p>Tillverkad i Sverige av återvunnet material bidrar våra produkter till en mer regenerativ framtid.
        Varje kollektion släpps i begränsad upplaga – för hållbarhet, kreativitet och personlig stil.</p>


    <div class="about-speaker-wrapper">
        <img src="/assets/images/kinforma-speaker.svg" alt="Kinforma speaker">
    </div>


    <script>
        // About section img scroll effect

        const aboutSection = document.querySelector('.about-carousel');
        const scrollPerClick = 300;

        function scrollAboutSection(direction) {
            if (direction === 'left') {
                aboutSection.scrollBy({
                    left: -scrollPerClick,
                    behavior: 'smooth'
                });
            } else if (direction === 'right') {
                aboutSection.scrollBy({
                    left: scrollPerClick,
                    behavior: 'smooth'
                });
            }
        }

        document.querySelector('.navigation-icons svg:first-child')
            .addEventListener('click', () => scrollAboutSection('left'));

        document.querySelector('.navigation-icons svg:last-child')
            .addEventListener('click', () => scrollAboutSection('right'));
    </script>

</section>