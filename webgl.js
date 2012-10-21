/* 
Copyright (c) 2012 Daniel Minor 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var mat = {};

mat.fromQuat = function(q)
{ 
    var m = new glMatrixArrayType(16);

    return m;
}

mat.makeIdentity = function()
{ 
    var m = new glMatrixArrayType(16);

    m[0] = 1; m[4] = 0;  m[8] = 0; m[12] = 0;
    m[1] = 0; m[5] = 1;  m[9] = 0; m[13] = 0;
    m[2] = 0; m[6] = 0; m[10] = 1; m[14] = 0;
    m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;

    return m;
}

mat.makeOrtho = function(w, h, n, f)
{
    var m = new glMatrixArrayType(16);

    m[0] = 2/w; m[4] = 0;    m[8] = 0;          m[12] = 0;
    m[1] = 0;   m[5] = 2/h;  m[9] = 0;          m[13] = 0;
    m[2] = 0;   m[6] = 0;   m[10] = -2/(f - n); m[14] = -(f + n)/(f - n);
    m[3] = 0;   m[7] = 0;   m[11] = 0;          m[15] = 1;

    return m;
}

mat.makePersp = function(fovy, a, zn, zf)
{ 
    var f = 1/Math.tan(fovy/360*3.14159265358979323);
    var m = new glMatrixArrayType(16);

    m[0] = f/a; m[4] = 0; m[8] = 0;                    m[12] = 0;
    m[1] = 0;   m[5] = f; m[9] = 0;                    m[13] = 0;
    m[2] = 0;   m[6] = 0; m[10] = (zf + zn)/(zn - zf); m[14] = 2*zf*zn/(zn - zf);
    m[3] = 0;   m[7] = 0; m[11] = -1;                  m[15] = 0;

    return m;
}

mat.makeTranslate = function(x, y, z)
{
    var m = new glMatrixArrayType(16);

    m[0] = 1; m[4] = 0;  m[8] = 0; m[12] = x;
    m[1] = 0; m[5] = 1;  m[9] = 0; m[13] = y;
    m[2] = 0; m[6] = 0; m[10] = 1; m[14] = z;
    m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;
    
    return m;
}

mat.mul = function (m, n)
{ 
    var r = new glMatrixArrayType(16);

    for (var i = 0; i < 4; ++i) {
        var col = i*4;
        var n0 = n[col];
        var n1 = n[col + 1];
        var n2 = n[col + 2];
        var n3 = n[col + 3];

        r[col]     = m[0]*n0 + m[4]*n1 +  m[8]*n2 + m[12]*n3;
        r[col + 1] = m[1]*n0 + m[5]*n1 +  m[9]*n2 + m[13]*n3;
        r[col + 2] = m[2]*n0 + m[6]*n1 + m[10]*n2 + m[14]*n3;
        r[col + 3] = m[3]*n0 + m[7]*n1 + m[11]*n2 + m[15]*n3; 
    }

    return r;
}

var quat = {}

quat.makeRotation = function(x, y, z, th)
{
    var scale = Math.sin(th/2); 
    var r = new glMatrixArrayType(4);
    r[0] = Math.cos(th/2);
    r[1] = x*scale;
    r[2] = y*scale;
    r[3] = z*scale;

    return r;
}

quat.mul = function(q1, q2)
{
    var r = new glMatrixArrayType(4); 
    r[0] = q1[0]*q2[0] - (q1[1]*q2[1] + q1[2]*q2[2] + q1[3]*q2[3]);
    r[1] = q1[0]*q1[1] + q2[0]*q1[1] + (q1[2]*q2[3] - q1[3]*q2[2]);
    r[2] = q1[0]*q1[2] + q2[0]*q1[2] - (q1[1]*q2[3] - q1[3]*q2[1]);
    r[1] = q1[0]*q1[3] + q2[0]*q1[3] + (q1[1]*q2[2] - q1[2]*q2[1]);

    return r;
}

var program = {}

program.compile = function(text, type)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, text);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
    }

    return shader;
}

program.compileFromElement = function(element, type)
{ 
    var src = "";
    var next = element.firstChild;
    while(next) {
        if (next.nodeType == next.TEXT_NODE) {
            src += next.textContent;
        }

        next = next.nextSibling;
    }

    return program.compile(src, type);
}

program.link = function(vshader, fshader)
{
    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
   
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log('Could not link shaders');
    }

    return program;
} 
