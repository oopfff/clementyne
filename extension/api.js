(function () {
    // modified Scratchsploit API
    "use strict";
    console.log("Loaded minimal Scratchsploit (Cloud + Low-level only)");

    const proxy = Proxy;
    const reflect = {};
    for (let k of Object.getOwnPropertyNames(Reflect)) {
        reflect[k] = Reflect[k];
    }
    const spoof = new WeakMap;

    const hookp = function (o, n, h) {
        const p = new proxy(o[n], h);
        spoof.set(p, o[n]);
        o[n] = p;
    };

    const getnative = function (f) {
        while (spoof.has(f)) f = spoof.get(f);
        return f;
    };

    window.getnative = getnative;

    function oninject() {
        const cloud = vm.runtime.ioDevices.cloud;
        let inter = setInterval(() => {
            if (cloud.provider == null) return;
            clearInterval(inter);
            const provider = cloud.provider;
            provider.clear = () => { };
            provider.requestCloseConnection = () => { };
            reflect.defineProperty(cloud, "provider", {
                value: provider,
                writable: false
            });
        });

        (() => {
            const CLOSE = () => { };
            setInterval(() => {
                try {
                    if (vm.runtime.ioDevices.cloud.provider.connection.close !== CLOSE) {
                        vm.runtime.ioDevices.cloud.provider.connection.close = CLOSE;
                    }
                } catch (e) { }
            });
        })();
    }

    hookp(Function.prototype, "bind", {
        apply(f, th, args) {
            try {
                if (args[0].runtime != null && args[0].hasOwnProperty("editingTarget")) {
                    console.log("%cVM detected and hooked (Cloud + Low-level)", "color: #4dff36; font-size:150%");
                    vm = args[0];
                    window.vm = vm;
                    Function.prototype.bind = f;
                    oninject();
                }
            } catch (e) { }
            return reflect.apply(f, th, args);
        }
    });

    let vm = document.getElementById('app')?._reactRootContainer?._internalRoot?.current?.child?.pendingProps?.store?.getState()?.scratchGui?.vm;
    if (vm != null) {
        console.log("%cVM preloaded and hooked (Cloud + Low-level)", "color: #4dff36; font-size:150%");
        window.vm = vm;
        oninject();
    }

    (() => {
        const accessor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "response");
        Object.defineProperty(XMLHttpRequest.prototype, "response", {
            get() {
                try {
                    if (this.url.endsWith("/session/")) {
                        const r = accessor.get.call(this);
                        try {
                            if (r.permissions != null) {
                                r.permissions.new_scratcher = false;
                                r.permissions.scratcher = true;
                                r.user.banned = false;
                                return r;
                            }
                        } catch (e) { }
                    }
                } catch (e) { }
                return accessor.get.call(this);
            }
        });

        const m = new WeakMap;
        Object.defineProperty(Object.prototype, "thread", {
            get() {
                return m.get(this);
            },
            set(v) {
                if (reflect.getOwnPropertyDescriptor(this, "sequencer") !== undefined && window.thread !== this) {
                    window.thread = this;
                }
                return m.set(this, v);
            }
        });

        hookp(Object, "defineProperty", {
            apply(f, th, args) {
                try {
                    if (args[1] === "prototype" && args[2].writable === false && args[0].prototype._sendCloudData != null) {
                        window.providerconstructor = args[0];
                    }
                } catch (e) { }
                return reflect.apply(f, th, args);
            }
        });
    })();
})();