#!/usr/bin/env python

from __future__ import division  # division with floats

import gmpy2
from gmpy2 import mpz
gmpy2.get_context().precision = 1100

from pkcs1 import rsaes_pkcs1_v15, keys, primitives

N1 = 179769313486231590772930519078902473361797697894230657273430081157732675805505620686985379449212982959585501387537164015710139858647833778606925583497541085196591615128057575940752635007475935288710823649949940771895617054361149474865046711015101563940680527540071584560878577663743040086340742855278549092581

N2 = 648455842808071669662824265346772278726343720706976263060439070378797308618081116462714015276061417569195587321840254520655424906719892428844841839353281972988531310511738648965962582821502504990264452100885281673303711142296421027840289307657458645233683357077834689715838646088239640236866252211790085787877

N3 = 720062263747350425279564435525583738338084451473999841826653057981916355690188337790423408664187663938485175264994017897083524079135686877441155132015188279331812309091996246361896836573643119174094961348524639707885238799396839230364676670221627018353299443241192173812729276147530748597302192751375739387929

RSACipherText = 22096451867410381776306561134883418017410069787892831071731839143676135600120538004282329650473509424343946219751512256465839967942889460764542040581564748988013734864120452325229320176487916666402997509188729971690526083222067771600019329260870009579993724077458967773697817571267229951148662959627934791540

# A = ceil(\sqrt(N))
def computeA(N):
    return gmpy2.ceil(gmpy2.sqrt(N))

def computeA2(N):
    return pow(computeA(N), 2)

# x = \sqrt(A^{2} - N)
def computeX(N):
    A2 = computeA2(N)
    return gmpy2.sqrt(gmpy2.sub(A2, N))

# P = A - x
def computeP(N):
    return gmpy2.sub(computeA(N), computeX(N))

# Q = A + x
def computeQ(N):
    return gmpy2.add(computeA(N), computeX(N))

# Test primality of the factors, that they multiply to compute N, then
# return the smaller one.
def confirmed(N, p, q):
    if gmpy2.is_prime(mpz(p)) and gmpy2.is_prime(mpz(q)) and N == gmpy2.mul(p, q):
        print "N =", N
        print "p =", p
        print "q =", q
        print "confirmed prime factors, smaller prime:"
        print q if p > q else p
        return True
    return False

def computeN1Factors():
    p = computeP(N1)
    q = computeQ(N1)
    confirmed(N1, p, q)

def computeN2Factors():
    p = 0
    q = 0
    A = computeA(N2)

    while not confirmed(N2, p, q):
        A2 = pow(A, 2)
        assert A2 > N2
        x = gmpy2.sqrt(gmpy2.sub(A2, N2))
        p = gmpy2.sub(A, x)
        q = gmpy2.add(A, x)
        A += 1

def computeN3Factors():
    A = gmpy2.ceil(gmpy2.mul(2, gmpy2.sqrt(gmpy2.mul(6, N3))))
    X = gmpy2.ceil(
        gmpy2.sqrt(
            gmpy2.sub(
                pow(A, 2),
                gmpy2.mul(24, N3)
            )
        )
    )
    p = gmpy2.ceil(gmpy2.div(gmpy2.sub(A, X), 6)) # Only round one.
    q = gmpy2.div(N3, p)
    confirmed(N3, p, q)


def factorRSA():
    e = 65537
    p = computeP(N1)
    q = computeQ(N1)
    orderN = N1 - p - q + 1
    d = gmpy2.invert(mpz(e), mpz(orderN))
    plaintext = gmpy2.powmod(RSACipherText, d, N1)
    print hex(plaintext)


#computeN1Factors()
#computeN2Factors()
computeN3Factors()
#factorRSA()
