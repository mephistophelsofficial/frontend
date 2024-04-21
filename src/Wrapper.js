import {AppShell, Container} from "@mantine/core";
import {Outlet} from "react-router-dom";


export function Wrapper() {
    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
            </AppShell.Header>

            {/*<AppShell.Navbar p="md">Navbar</AppShell.Navbar>*/}
            <Container size='lg'>
                <AppShell.Main><Outlet/></AppShell.Main>
            </Container>
        </AppShell>
    );
}