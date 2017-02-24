

declare function using<T> (
    name: string, 
    values: T[], 
    func: (T) => void);

describe("tests/01_SimpleJasmineTests.ts ", () => {
    it("value that has been assigned should be defined", () => {
        let undefinedValue = "test";
        expect(undefinedValue).toBeDefined();
    });
it("exptect a value not to be defined", () => {
    let undefinedValue;
    expect(undefinedValue).not.toBeDefined();
});

it("expect value toBe(2)", () => {
    let twoValue = 2;
    expect(twoValue).toBe(2);
})
it("expect string toContain value ", () => {
    let testString = "12345a";
    expect(testString).toContain("a");
});
it("expect true to be truthy", () => {
    let trueValue = true;
    expect(trueValue).toBeTruthy();
});
it("expect false not to be truthy", () => {
    let falseValue = false;
    expect(falseValue).not.toBeTruthy();
});

it("expect value not to be null", () => {
    let definedValue = 2;
    expect(definedValue).not.toBe(null);
});

it("expect objects to be equal", () => {
    let obj1 = {a : 1, b : 2};
    let obj2 = {b : 2, a : 1};

    expect(obj1).toEqual(obj2);
});

describe("beforEach and afterEach tests", () => {
    let myString;
    beforeEach( () => {
        myString = "this is a string";
    });
    afterEach( () => {
        expect(myString).toBeUndefined();
    });
    it("should find then clear the myString varialbe", () => {
        expect(myString).toEqual("this is a string");
        myString = undefined;
    });
});

describe("data driven tests", () => {
    using("valid values", [
        "first string",
        "second string",
        "third string"
    ], (value) => {
        it(`${value} should contain 'string'`, () => {
            expect(value).toContain("string");
        });
    });
});

class MySpiedClass {
    testFunction(arg1: string) {
        console.log(arg1);
    }
}
describe("simple spy", () => {
    it("should spyOn a function call", () => {
        let classInstance = new MySpiedClass();
        let testFunctionSpy 
            = spyOn(classInstance, 'testFunction');

    
        classInstance.testFunction("test");
        
        expect(testFunctionSpy).toHaveBeenCalled();
    });
});

class CallbackClass {
    doCallBack(id: number, callback: (result: string) => void ) {
        let callbackValue = "id:" + id.toString();
        callback(callbackValue);
    }
}

class DoCallBack {
    logValue(value: string) {
        console.log(value);
    }
}

describe("using callback spies", () => {
    it("should execute callback with the correct string value", 
        () => {
        let doCallback = new DoCallBack();
        let classUnderTest = new CallbackClass();

        let callbackSpy = spyOn(doCallback, 'logValue');
        classUnderTest.doCallBack(1, doCallback.logValue);

        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy).toHaveBeenCalledWith("id:1");

    });
});

class ClassToFake {
    getValue() : number {
        return 2;
    }
}
describe("using fakes", () => {
    it("calls fake instead of real function", () => {
        let classToFake = new ClassToFake();
        spyOn(classToFake, 'getValue').and.callFake ( () => {
            return 5;
        });
        expect(classToFake.getValue()).toBe(5);
    });
});

class MockAsyncClass {
    executeSlowFunction(success: (value: string) => void) {
        setTimeout(() => {
            success("success");
        }, 1000);
    }
}

// describe("asynchronous tests", () => {
//     xit("failing test", () => {
    
//         var mockAsync = new MockAsyncClass();
//         var returnedValue : string;
//         mockAsync.executeSlowFunction((value: string) => {
//             returnedValue = value;
//         });
//         expect(returnedValue).toEqual("success");
//     });
    
// });



describe("asynch tests with done", () => {
    let returnedValue;

    beforeEach((done) => {
        returnedValue = "no_return_value";
        let mockAsync = new MockAsyncClass();
        mockAsync.executeSlowFunction((value: string) => {
            returnedValue = value;
            done();
        });
    });

    it("should return success after 1 second", (done) => {
        expect(returnedValue).toEqual("success");
        done();
    });
});

class ModifyDomElement {
    setHtml() {
        let elem = $('#my_div');
        elem.html('<p>Hello World</p>');
    }
}

describe("fixture tests", () => {
    it("should modify a dom element", () => {
        setFixtures('<div id="my_div"></div>');
        let modifyDom = new ModifyDomElement();
        modifyDom.setHtml();
        let modifiedDomElement = $('#my_div');
        expect(modifiedDomElement.length).toBeGreaterThan(0);
        expect(modifiedDomElement.html()).toContain("Hello");
    });
});

describe("click event tests", () => {
    it("should trigger an onclick DOM event", () =>{
        setFixtures(`
            <script>
            function handle_my_click_div_clicked() { 
                // do nothing at this time
            }
            </script>        
            <div id='my_click_div'
            onclick='handle_my_click_div_clicked()'>Click Here</div>`);
        let clickEventSpy = spyOnEvent('#my_click_div', 'click');
        $('#my_click_div').click();
        expect(clickEventSpy).toHaveBeenTriggered();
    });
});


});