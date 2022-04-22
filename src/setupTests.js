
beforeEach(() => {
    // if there is a console.warn or error then we have an issue that needs to be resolved.
    jest.spyOn(console, "warn");
    jest.spyOn(console, "error")
});

afterEach(() => {
    expect(console.warn).not.toBeCalled();
    expect(console.error).not.toBeCalled();
});
