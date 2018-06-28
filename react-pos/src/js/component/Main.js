import React from "react";
import { Switch, Route } from "react-router-dom";
import Inventory from "./Inventory";
import Pos from "./Pos";
import Transactions from "./Transactions";
import LiveCart from "./LiveCart";

const Main = () => (
    <main>
        <Switch>
            <Route exact path="/" component={Pos} />
            <Route exact path="/inventory" component={Inventory} />
            <Route exact path="/transactions" component={Transactions} />
            <Route exact path="/livecart" component={LiveCart} />
        </Switch>
    </main>
);

export default Main;